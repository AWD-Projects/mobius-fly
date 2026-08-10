-- ═══════════════════════════════════════════════════════════════════════════
-- PAYMENT SYSTEM MIGRATION
-- • Adds blocked_until, purchase_type to reservations
-- • Adds email, phone to reservation_passengers
-- • Creates lock_seats_and_create_reservation() RPC (atomic seat lock)
-- • Creates expire_blocked_reservations() (called by pg_cron)
-- • Enables pg_cron and schedules the expiration job (every 1 minute)
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Schema changes
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS blocked_until  timestamptz,
  ADD COLUMN IF NOT EXISTS purchase_type  varchar(20) NOT NULL DEFAULT 'seats';

CREATE INDEX IF NOT EXISTS idx_reservations_blocked_expiry
  ON reservations (blocked_until)
  WHERE blocked_until IS NOT NULL;

ALTER TABLE reservation_passengers
  ADD COLUMN IF NOT EXISTS email  varchar(255),
  ADD COLUMN IF NOT EXISTS phone  varchar(50);

-- 2. Atomic seat-locking + reservation creation
CREATE OR REPLACE FUNCTION lock_seats_and_create_reservation(
  p_flight_id         uuid,
  p_user_id           uuid,
  p_purchase_type     text,
  p_seats_requested   int,
  p_booking_reference text,
  p_contact_full_name text,
  p_contact_email     text,
  p_contact_phone     text,
  p_base_price_total  numeric
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_available_seats   int;
  v_total_seats       int;
  v_blocked_status_id uuid;
  v_reservation_id    uuid;
BEGIN
  SELECT id INTO v_blocked_status_id FROM reservation_status WHERE code = 'BLOCKED';

  SELECT available_seats, total_seats
    INTO v_available_seats, v_total_seats
    FROM flights WHERE id = p_flight_id FOR UPDATE;

  IF v_available_seats < p_seats_requested THEN
    RAISE EXCEPTION 'NOT_ENOUGH_SEATS'
      USING DETAIL = format('Requested %s, only %s available', p_seats_requested, v_available_seats);
  END IF;

  IF p_purchase_type = 'full_aircraft' AND v_available_seats < v_total_seats THEN
    RAISE EXCEPTION 'FULL_AIRCRAFT_NOT_AVAILABLE'
      USING DETAIL = format('%s of %s seats already taken', v_total_seats - v_available_seats, v_total_seats);
  END IF;

  UPDATE flights
     SET available_seats = available_seats - p_seats_requested, updated_at = now()
   WHERE id = p_flight_id;

  INSERT INTO reservations (
    flight_id, user_id, purchase_type, booking_reference,
    contact_full_name, contact_email, contact_phone,
    seats_requested, base_price_total, reservation_status_id, blocked_until
  ) VALUES (
    p_flight_id, p_user_id, p_purchase_type, p_booking_reference,
    p_contact_full_name, p_contact_email, p_contact_phone,
    p_seats_requested::smallint, p_base_price_total, v_blocked_status_id,
    now() + interval '15 minutes'
  )
  RETURNING id INTO v_reservation_id;

  RETURN v_reservation_id;
END;
$$;

REVOKE ALL ON FUNCTION lock_seats_and_create_reservation(uuid,uuid,text,int,text,text,text,text,numeric) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION lock_seats_and_create_reservation(uuid,uuid,text,int,text,text,text,text,numeric) TO service_role;

-- 3. Expiration function (pg_cron target — idempotent)
CREATE OR REPLACE FUNCTION expire_blocked_reservations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_blocked_id uuid;
  v_expired_id uuid;
BEGIN
  SELECT id INTO v_blocked_id FROM reservation_status WHERE code = 'BLOCKED';
  SELECT id INTO v_expired_id FROM reservation_status WHERE code = 'EXPIRED';

  WITH expired_rows AS (
    UPDATE reservations
       SET reservation_status_id = v_expired_id, updated_at = now()
     WHERE reservation_status_id = v_blocked_id AND blocked_until < now()
     RETURNING id, flight_id, seats_requested
  )
  UPDATE flights f
     SET available_seats = f.available_seats + e.seats_requested, updated_at = now()
    FROM expired_rows e WHERE f.id = e.flight_id;
END;
$$;

REVOKE ALL ON FUNCTION expire_blocked_reservations() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION expire_blocked_reservations() TO service_role;

-- 4. pg_cron setup
CREATE EXTENSION IF NOT EXISTS pg_cron;
GRANT USAGE ON SCHEMA cron TO postgres;

DO $$ BEGIN PERFORM cron.unschedule('expire-blocked-reservations'); EXCEPTION WHEN OTHERS THEN NULL; END; $$;

SELECT cron.schedule(
  'expire-blocked-reservations',
  '* * * * *',
  $$SELECT public.expire_blocked_reservations()$$
);
