-- Reglas de edicion de vuelos aplicadas en la base (antes solo estaban en la UI).
--
-- 1. Con asientos vendidos o bloqueados (total - disponibles > 0) el propietario
--    no puede cambiar precios, aeropuertos ni fechas. La fecha solo se puede mover
--    cuando el vuelo esta DELAYED (misma regla que EditFlightContent.tsx).
-- 2. flight_crew dejaba de ser publico para vuelos no visibles: ahora hereda la
--    visibilidad de flights.
-- Admin y backend (service role) no se ven afectados: is_restricted_actor().

CREATE OR REPLACE FUNCTION public.guard_flights()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_old_code text;
  v_new_code text;
  v_sold     integer;
BEGIN
  IF NOT public.is_restricted_actor() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    -- Todo vuelo nuevo entra a revision, con todos sus asientos libres.
    SELECT id INTO NEW.status_id FROM public.flight_status WHERE code = 'PENDING_REVIEW';
    NEW.rejected_reason := NULL;
    NEW.available_seats := NEW.total_seats;
    RETURN NEW;
  END IF;

  -- UPDATE
  IF NEW.owner_id        IS DISTINCT FROM OLD.owner_id
  OR NEW.rejected_reason IS DISTINCT FROM OLD.rejected_reason THEN
    RAISE EXCEPTION 'FORBIDDEN_COLUMN: owner_id/rejected_reason solo los cambia un administrador'
      USING ERRCODE = '42501';
  END IF;

  -- Se puede redimensionar el vuelo, pero NO inventar asientos libres:
  -- los asientos vendidos (total - disponibles) deben conservarse.
  IF NEW.available_seats IS DISTINCT FROM OLD.available_seats
  OR NEW.total_seats     IS DISTINCT FROM OLD.total_seats THEN
    IF NEW.available_seats < 0
    OR (NEW.total_seats - NEW.available_seats) <> (OLD.total_seats - OLD.available_seats) THEN
      RAISE EXCEPTION 'FORBIDDEN_COLUMN: available_seats no puede modificarse directamente'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  -- Con pasajeros (vendidos o bloqueados) el precio y la ruta quedan fijos.
  v_sold := OLD.total_seats - OLD.available_seats;
  IF v_sold > 0 THEN
    IF NEW.price_per_seat       IS DISTINCT FROM OLD.price_per_seat
    OR NEW.price_full_aircraft  IS DISTINCT FROM OLD.price_full_aircraft THEN
      RAISE EXCEPTION 'FORBIDDEN_COLUMN: el precio no puede cambiar con asientos vendidos o bloqueados'
        USING ERRCODE = '42501';
    END IF;

    IF NEW.departure_airport_id IS DISTINCT FROM OLD.departure_airport_id
    OR NEW.arrival_airport_id   IS DISTINCT FROM OLD.arrival_airport_id THEN
      RAISE EXCEPTION 'FORBIDDEN_COLUMN: la ruta no puede cambiar con asientos vendidos o bloqueados'
        USING ERRCODE = '42501';
    END IF;

    SELECT code INTO v_old_code FROM public.flight_status WHERE id = OLD.status_id;
    IF v_old_code IS DISTINCT FROM 'DELAYED' AND (
         NEW.departure_datetime        IS DISTINCT FROM OLD.departure_datetime
      OR NEW.arrival_datetime          IS DISTINCT FROM OLD.arrival_datetime
      OR NEW.return_departure_datetime IS DISTINCT FROM OLD.return_departure_datetime
      OR NEW.return_arrival_datetime   IS DISTINCT FROM OLD.return_arrival_datetime
    ) THEN
      RAISE EXCEPTION 'FORBIDDEN_COLUMN: las fechas solo se mueven con el vuelo en estado DELAYED cuando hay pasajeros'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  IF NEW.status_id IS DISTINCT FROM OLD.status_id THEN
    SELECT code INTO v_old_code FROM public.flight_status WHERE id = OLD.status_id;
    SELECT code INTO v_new_code FROM public.flight_status WHERE id = NEW.status_id;

    -- El propietario solo opera vuelos ya aprobados; aprobar/rechazar es del admin.
    IF v_old_code IN ('SCHEDULED','ON_TIME','DELAYED','IN_FLIGHT')
       AND v_new_code IN ('SCHEDULED','ON_TIME','DELAYED','IN_FLIGHT','COMPLETED','CANCELLED') THEN
      NULL;
    ELSE
      RAISE EXCEPTION 'FORBIDDEN_TRANSITION: % -> % no esta permitido', v_old_code, v_new_code
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END $$;

-- flight_crew: misma visibilidad que el vuelo (antes USING true).
DROP POLICY IF EXISTS flight_crew_public_select ON public.flight_crew;
CREATE POLICY flight_crew_public_select ON public.flight_crew
  FOR SELECT
  USING (flight_id IN (SELECT id FROM public.flights));
