-- Evita secuestro de funciones via search_path mutable (advisor 0011).
ALTER FUNCTION public.set_flight_status_pending_review() SET search_path = public;
ALTER FUNCTION public.expire_blocked_reservations() SET search_path = public;
ALTER FUNCTION public.expire_blocked_reservations_for_flight(uuid) SET search_path = public;
ALTER FUNCTION public.get_user_id_by_email(text) SET search_path = public;
ALTER FUNCTION public.check_crew_member_not_in_flights() SET search_path = public;
