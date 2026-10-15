-- =============================================================================
-- Columnas privilegiadas: ningun usuario con sesion (no admin) puede cambiarlas.
--
-- Problema: las politicas RLS de UPDATE validan SOLO la fila (user_id = auth.uid()),
-- no las columnas. Con la anon key + su propio JWT, cualquier usuario podia:
--   * user_profiles.role = 'ADMIN'   -> escalada total (is_admin() lee ese campo)
--   * owners.status = 'ACTIVE'       -> auto-aprobarse como propietario
--   * flights.status_id / available_seats / is_visible
--   * user_documents / aircraft_documents.document_status_id = APPROVED
--   * crew_members.is_approved = true
--
-- Solucion: triggers BEFORE INSERT/UPDATE. Se aplican solo cuando hay un usuario
-- autenticado que NO es admin (auth.uid() NOT NULL AND NOT is_admin()). El
-- service_role, postgres y pg_cron tienen auth.uid() NULL, asi que el backend y
-- los jobs siguen funcionando igual.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.is_restricted_actor()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL AND NOT public.is_admin();
$$;

-- ── user_profiles ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.guard_user_profiles()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF public.is_restricted_actor() THEN
    IF NEW.role   IS DISTINCT FROM OLD.role
    OR NEW.status IS DISTINCT FROM OLD.status
    OR NEW.id     IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'FORBIDDEN_COLUMN: role/status/id solo los cambia un administrador'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_guard_user_profiles ON public.user_profiles;
CREATE TRIGGER trg_guard_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_user_profiles();

-- ── owners ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.guard_owners()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF public.is_restricted_actor() THEN
    IF NEW.status                         IS DISTINCT FROM OLD.status
    OR NEW.user_id                        IS DISTINCT FROM OLD.user_id
    OR NEW.stripe_account_id              IS DISTINCT FROM OLD.stripe_account_id
    OR NEW.stripe_charges_enabled         IS DISTINCT FROM OLD.stripe_charges_enabled
    OR NEW.stripe_payouts_enabled         IS DISTINCT FROM OLD.stripe_payouts_enabled
    OR NEW.stripe_details_submitted       IS DISTINCT FROM OLD.stripe_details_submitted
    OR NEW.stripe_onboarding_completed_at IS DISTINCT FROM OLD.stripe_onboarding_completed_at THEN
      RAISE EXCEPTION 'FORBIDDEN_COLUMN: status/stripe_* solo los cambia un administrador o el backend'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_guard_owners ON public.owners;
CREATE TRIGGER trg_guard_owners
  BEFORE UPDATE ON public.owners
  FOR EACH ROW EXECUTE FUNCTION public.guard_owners();

-- ── flights ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.guard_flights()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_old_code text;
  v_new_code text;
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

DROP TRIGGER IF EXISTS trg_guard_flights ON public.flights;
CREATE TRIGGER trg_guard_flights
  BEFORE INSERT OR UPDATE ON public.flights
  FOR EACH ROW EXECUTE FUNCTION public.guard_flights();

-- ── user_documents / aircraft_documents ──────────────────────────────────────
-- El propietario puede subir o reemplazar el archivo, pero el documento siempre
-- queda "en revision"; aprobar o rechazar es del admin.
CREATE OR REPLACE FUNCTION public.guard_documents()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_pending uuid;
BEGIN
  IF NOT public.is_restricted_actor() THEN
    RETURN NEW;
  END IF;

  SELECT id INTO v_pending FROM public.document_status WHERE code = 'PENDING_REVIEW';

  IF TG_OP = 'INSERT' THEN
    NEW.document_status_id := v_pending;
    NEW.rejected_reason    := NULL;
    RETURN NEW;
  END IF;

  IF NEW.document_url IS DISTINCT FROM OLD.document_url THEN
    NEW.document_status_id := v_pending;
    NEW.rejected_reason    := NULL;
  ELSIF NEW.document_status_id IS DISTINCT FROM OLD.document_status_id
     OR NEW.rejected_reason    IS DISTINCT FROM OLD.rejected_reason THEN
    RAISE EXCEPTION 'FORBIDDEN_COLUMN: el estado del documento solo lo cambia un administrador'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_guard_user_documents ON public.user_documents;
CREATE TRIGGER trg_guard_user_documents
  BEFORE INSERT OR UPDATE ON public.user_documents
  FOR EACH ROW EXECUTE FUNCTION public.guard_documents();

DROP TRIGGER IF EXISTS trg_guard_aircraft_documents ON public.aircraft_documents;
CREATE TRIGGER trg_guard_aircraft_documents
  BEFORE INSERT OR UPDATE ON public.aircraft_documents
  FOR EACH ROW EXECUTE FUNCTION public.guard_documents();

-- ── crew_members ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.guard_crew_members()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NOT public.is_restricted_actor() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.is_approved     := false;
    NEW.rejected_reason := NULL;
    IF NEW.status = 'REJECTED' THEN NEW.status := 'ACTIVE'; END IF;
    RETURN NEW;
  END IF;

  IF NEW.is_approved     IS DISTINCT FROM OLD.is_approved
  OR NEW.rejected_reason IS DISTINCT FROM OLD.rejected_reason
  OR NEW.owner_id        IS DISTINCT FROM OLD.owner_id THEN
    RAISE EXCEPTION 'FORBIDDEN_COLUMN: is_approved/rejected_reason solo los cambia un administrador'
      USING ERRCODE = '42501';
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status
     AND (OLD.status = 'REJECTED' OR NEW.status = 'REJECTED') THEN
    RAISE EXCEPTION 'FORBIDDEN_COLUMN: el estado REJECTED solo lo gestiona un administrador'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_guard_crew_members ON public.crew_members;
CREATE TRIGGER trg_guard_crew_members
  BEFORE INSERT OR UPDATE ON public.crew_members
  FOR EACH ROW EXECUTE FUNCTION public.guard_crew_members();

-- ── Visibilidad publica ──────────────────────────────────────────────────────
-- Un vuelo en revision o rechazado nunca es publico, aunque is_visible = true.
-- (El admin lo aprueba cambiando status_id y queda visible sin otro paso.)
DROP POLICY IF EXISTS flights_select_access ON public.flights;
CREATE POLICY flights_select_access ON public.flights
  FOR SELECT
  USING (
    (
      is_visible = true
      AND status_id NOT IN (
        SELECT id FROM public.flight_status WHERE code IN ('PENDING_REVIEW','REJECTED')
      )
    )
    OR owner_id IN (SELECT o.id FROM public.owners o WHERE o.user_id = (SELECT auth.uid()))
    OR (SELECT public.is_admin())
  );

-- ── Datos personales de la tripulacion ───────────────────────────────────────
-- Antes: SELECT publico (true) con email, telefono y licencia de TODA la tripulacion.
-- Ahora: solo su propietario, un admin, o tripulacion asignada a un vuelo visible;
-- y el rol anon ya no puede leer email / phone / license_number.
DROP POLICY IF EXISTS crew_members_public_select ON public.crew_members;
CREATE POLICY crew_members_select_scoped ON public.crew_members
  FOR SELECT
  USING (
    owner_id = public.get_my_owner_id()
    OR (SELECT public.is_admin())
    OR EXISTS (
      SELECT 1
        FROM public.flight_crew fc
        JOIN public.flights f ON f.id = fc.flight_id
       WHERE fc.crew_member_id = crew_members.id
         AND f.is_visible = true
    )
  );

REVOKE SELECT (email, phone, license_number) ON public.crew_members FROM anon;

-- ── Funciones internas: solo el backend ──────────────────────────────────────
-- Por defecto Postgres da EXECUTE a PUBLIC; Supabase lo expone en /rest/v1/rpc.
DO $$
DECLARE
  f text;
BEGIN
  FOREACH f IN ARRAY ARRAY[
    'public.lock_seats_and_create_reservation(uuid,uuid,text,integer,text,text,text,text,numeric)',
    'public.cancel_blocked_reservation(uuid)',
    'public.expire_blocked_reservations()',
    'public.expire_blocked_reservations_for_flight(uuid)',
    'public.get_user_id_by_email(text)',
    'public.handle_new_user()',
    'public.set_flight_status_pending_review()',
    'public.check_crew_member_not_in_flights()'
  ] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', f);
  END LOOP;
END $$;
