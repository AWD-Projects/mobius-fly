-- ═══════════════════════════════════════════════════════════════════════════
-- LAZY EXPIRATION IN RPC
-- • Adds expire_blocked_reservations_for_flight(uuid) — per-flight helper
-- • Updates lock_seats_and_create_reservation() to call it before checking
--   seat availability, so expired seats are freed instantly on new attempts
--   instead of waiting up to 59s for the pg_cron job.
-- • pg_cron every minute is kept as a safety net for reservations that are
--   never re-attempted (e.g. user closes the tab without trying again).
-- ═══════════════════════════════════════════════════════════════════════════

-- Per-flight expiration helper (scoped to one flight — faster than full scan)
CREATE OR REPLACE FUNCTION expire_blocked_reservations_for_flight(p_flight_id uuid)
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
     WHERE flight_id = p_flight_id
       AND reservation_status_id = v_blocked_id
       AND blocked_until < now()
     RETURNING id, flight_id, seats_requested
  )
  UPDATE flights f
     SET available_seats = f.available_seats + e.seats_requested, updated_at = now()
    FROM expired_rows e WHERE f.id = e.flight_id;
END;
$$;

REVOKE ALL ON FUNCTION expire_blocked_reservations_for_flight(uuid) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION expire_blocked_reservations_for_flight(uuid) TO service_role;

-- Updated RPC: calls lazy expiration before seat check
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
  -- 0. Expire stale blocked reservations for this flight before checking seats
  PERFORM expire_blocked_reservations_for_flight(p_flight_id);

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
