-- ═══════════════════════════════════════════════════════════════════════════
-- CANCEL BLOCKED RESERVATION (compensation transaction)
-- Atomically sets a BLOCKED reservation to EXPIRED and restores its seats.
-- Called when post-reservation inserts (passengers, payments) fail so seats
-- are freed immediately instead of waiting for the 15-minute cron expiry.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION cancel_blocked_reservation(p_reservation_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_expired_id      uuid;
  v_blocked_id      uuid;
  v_flight_id       uuid;
  v_seats_requested smallint;
BEGIN
  SELECT id INTO v_expired_id FROM reservation_status WHERE code = 'EXPIRED';
  SELECT id INTO v_blocked_id FROM reservation_status WHERE code = 'BLOCKED';

  UPDATE reservations
     SET reservation_status_id = v_expired_id, updated_at = now()
   WHERE id = p_reservation_id
     AND reservation_status_id = v_blocked_id
  RETURNING flight_id, seats_requested
    INTO v_flight_id, v_seats_requested;

  IF v_flight_id IS NOT NULL THEN
    UPDATE flights
       SET available_seats = available_seats + v_seats_requested, updated_at = now()
     WHERE id = v_flight_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION cancel_blocked_reservation(uuid) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION cancel_blocked_reservation(uuid) TO service_role;
