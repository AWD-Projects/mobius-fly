-- Las tablas OTP solo las toca el backend con service role (bypass de RLS).
-- RLS activo sin politicas + sin permisos para anon/authenticated = inaccesibles por la API REST.
-- Aplicada en el proyecto MobiusFly el 2026-10-15 (hotfix).
ALTER TABLE public.signup_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.signup_otps FROM anon, authenticated;
REVOKE ALL ON TABLE public.password_reset_otps FROM anon, authenticated;
