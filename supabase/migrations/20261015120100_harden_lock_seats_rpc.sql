-- Endurece lock_seats_and_create_reservation:
--  * El vuelo debe ser visible y estar en estado reservable (SCHEDULED, ON_TIME, DELAYED).
--  * El precio base se valida contra flights.price_per_seat / price_full_aircraft;
--    ya no se confia en el valor que manda el cliente.
--  * Compra de aeronave completa bloquea TODOS los asientos del vuelo
--    (antes solo bloqueaba los que mandaba el cliente y el resto se podia revender).
--  * Valida tipo de compra y cantidad de asientos.
-- Firma sin cambios: conserva grants y llamadas existentes.
CREATE OR REPLACE FUNCTION public.lock_seats_and_create_reservation(
  p_flight_id          uuid,
  p_user_id            uuid,
  p_purchase_type      text,
  p_seats_requested    integer,
  p_booking_reference  text,
  p_contact_full_name  text,
  p_contact_email      text,
  p_contact_phone      text,
  p_base_price_total   numeric
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_available_seats    int;
  v_total_seats        int;
  v_departure_datetime timestamptz;
  v_price_per_seat     numeric;
  v_price_full         numeric;
  v_is_visible         boolean;
  v_status_code        text;
  v_expected_price     numeric;
  v_seats_to_lock      int;
  v_blocked_status_id  uuid;
  v_reservation_id     uuid;
BEGIN
  IF p_purchase_type IS NULL OR p_purchase_type NOT IN ('seats', 'full_aircraft') THEN
    RAISE EXCEPTION 'INVALID_PURCHASE_TYPE';
  END IF;

  IF p_seats_requested IS NULL OR p_seats_requested < 1 THEN
    RAISE EXCEPTION 'INVALID_SEATS_REQUESTED';
  END IF;

  -- 0. Expire stale blocked reservations for this flight before checking seats
  PERFORM expire_blocked_reservations_for_flight(p_flight_id);

  SELECT id INTO v_blocked_status_id FROM reservation_status WHERE code = 'BLOCKED';

  SELECT f.available_seats, f.total_seats, f.departure_datetime,
         f.price_per_seat, f.price_full_aircraft,
         COALESCE(f.is_visible, false), fs.code
    INTO v_available_seats, v_total_seats, v_departure_datetime,
         v_price_per_seat, v_price_full,
         v_is_visible, v_status_code
    FROM flights f
    JOIN flight_status fs ON fs.id = f.status_id
   WHERE f.id = p_flight_id
     FOR UPDATE OF f;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'FLIGHT_NOT_FOUND';
  END IF;

  -- 1. Flight must be approved, visible and still reservable
  IF NOT v_is_visible OR v_status_code NOT IN ('SCHEDULED', 'ON_TIME', 'DELAYED') THEN
    RAISE EXCEPTION 'FLIGHT_NOT_AVAILABLE'
      USING DETAIL = format('visible=%s status=%s', v_is_visible, v_status_code);
  END IF;

  IF p_seats_requested > v_total_seats THEN
    RAISE EXCEPTION 'INVALID_SEATS_REQUESTED'
      USING DETAIL = format('Requested %s, aircraft has %s seats', p_seats_requested, v_total_seats);
  END IF;

  -- 2. Server-side price: the client value is only checked, never trusted
  IF p_purchase_type = 'seats' THEN
    v_seats_to_lock  := p_seats_requested;
    v_expected_price := v_price_per_seat * p_seats_requested;
  ELSE
    IF v_price_full IS NULL OR v_price_full <= 0 THEN
      RAISE EXCEPTION 'FULL_AIRCRAFT_NOT_AVAILABLE'
        USING DETAIL = 'Flight does not offer full aircraft purchase';
    END IF;
    v_seats_to_lock  := v_total_seats;
    v_expected_price := v_price_full;
  END IF;

  IF v_expected_price IS NULL OR v_expected_price <= 0 THEN
    RAISE EXCEPTION 'INVALID_FLIGHT_PRICE';
  END IF;

  IF p_base_price_total IS NULL OR abs(p_base_price_total - v_expected_price) > 0.01 THEN
    RAISE EXCEPTION 'PRICE_MISMATCH'
      USING DETAIL = format('expected %s, got %s', v_expected_price, p_base_price_total);
  END IF;

  -- 3. Enforce 3-hour advance booking window
  IF v_departure_datetime - now() < interval '3 hours' THEN
    RAISE EXCEPTION 'FLIGHT_DEPARTURE_TOO_SOON'
      USING DETAIL = format(
        'Flight departs at %s, less than 3 hours from now (%s)',
        v_departure_datetime,
        now()
      );
  END IF;

  -- 4. Seat availability checks
  IF p_purchase_type = 'full_aircraft' AND v_available_seats < v_total_seats THEN
    RAISE EXCEPTION 'FULL_AIRCRAFT_NOT_AVAILABLE'
      USING DETAIL = format('%s of %s seats already taken', v_total_seats - v_available_seats, v_total_seats);
  END IF;

  IF v_available_seats < v_seats_to_lock THEN
    RAISE EXCEPTION 'NOT_ENOUGH_SEATS'
      USING DETAIL = format('Requested %s, only %s available', v_seats_to_lock, v_available_seats);
  END IF;

  -- 5. Lock seats (full aircraft locks every seat on the flight)
  UPDATE flights
     SET available_seats = available_seats - v_seats_to_lock, updated_at = now()
   WHERE id = p_flight_id;

  -- 6. Create reservation (seats_requested = seats actually locked, so
  --    expiry/cancel functions restore exactly what was taken)
  INSERT INTO reservations (
    flight_id, user_id, purchase_type, booking_reference,
    contact_full_name, contact_email, contact_phone,
    seats_requested, base_price_total, reservation_status_id, blocked_until
  ) VALUES (
    p_flight_id, p_user_id, p_purchase_type, p_booking_reference,
    p_contact_full_name, p_contact_email, p_contact_phone,
    v_seats_to_lock::smallint, v_expected_price, v_blocked_status_id,
    now() + interval '15 minutes'
  )
  RETURNING id INTO v_reservation_id;

  RETURN v_reservation_id;
END;
$function$;
