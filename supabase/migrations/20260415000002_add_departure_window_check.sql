-- ═══════════════════════════════════════════════════════════════════════════
-- ADD 3-HOUR DEPARTURE WINDOW CHECK TO RESERVATION RPC
--
-- Business rule: a flight cannot be reserved if it departs in less than
-- 3 hours from the time of the reservation attempt.
--
-- The check is placed in the DB (not just the app layer) so it cannot be
-- bypassed by calling the RPC directly with the service role.
-- ═══════════════════════════════════════════════════════════════════════════

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
  v_available_seats    int;
  v_total_seats        int;
  v_departure_datetime timestamptz;
  v_blocked_status_id  uuid;
  v_reservation_id     uuid;
BEGIN
  -- 0. Expire stale blocked reservations for this flight before checking seats
  PERFORM expire_blocked_reservations_for_flight(p_flight_id);

  SELECT id INTO v_blocked_status_id FROM reservation_status WHERE code = 'BLOCKED';

  SELECT available_seats, total_seats, departure_datetime
    INTO v_available_seats, v_total_seats, v_departure_datetime
    FROM flights WHERE id = p_flight_id FOR UPDATE;

  -- 1. Enforce 3-hour advance booking window
  IF v_departure_datetime - now() < interval '3 hours' THEN
    RAISE EXCEPTION 'FLIGHT_DEPARTURE_TOO_SOON'
      USING DETAIL = format(
        'Flight departs at %s, less than 3 hours from now (%s)',
        v_departure_datetime,
        now()
      );
  END IF;

  -- 2. Seat availability checks
  IF v_available_seats < p_seats_requested THEN
    RAISE EXCEPTION 'NOT_ENOUGH_SEATS'
      USING DETAIL = format('Requested %s, only %s available', p_seats_requested, v_available_seats);
  END IF;

  IF p_purchase_type = 'full_aircraft' AND v_available_seats < v_total_seats THEN
    RAISE EXCEPTION 'FULL_AIRCRAFT_NOT_AVAILABLE'
      USING DETAIL = format('%s of %s seats already taken', v_total_seats - v_available_seats, v_total_seats);
  END IF;

  -- 3. Lock seats
  UPDATE flights
     SET available_seats = available_seats - p_seats_requested, updated_at = now()
   WHERE id = p_flight_id;

  -- 4. Create reservation
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
