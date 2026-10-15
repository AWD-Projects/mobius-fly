-- 1) Contador de intentos por OTP (registro y recuperacion de contrasena)
ALTER TABLE public.signup_otps         ADD COLUMN IF NOT EXISTS attempts integer NOT NULL DEFAULT 0;
ALTER TABLE public.password_reset_otps ADD COLUMN IF NOT EXISTS attempts integer NOT NULL DEFAULT 0;

-- 2) Consumo ATOMICO de un intento. Se incrementa ANTES de comparar el codigo,
--    asi las peticiones en paralelo no pueden adivinar mas de p_max veces.
--    Devuelve 0 filas si no hay OTP pendiente o ya se agotaron los intentos.
CREATE OR REPLACE FUNCTION public.take_signup_otp_attempt(p_email text, p_max integer)
RETURNS TABLE (otp_hash text, expires_at timestamptz, payload jsonb)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.signup_otps s
     SET attempts = s.attempts + 1
   WHERE s.email = p_email AND s.attempts < p_max
  RETURNING s.otp_hash, s.expires_at, s.payload;
$$;

CREATE OR REPLACE FUNCTION public.take_reset_otp_attempt(p_email text, p_max integer)
RETURNS TABLE (otp_hash text, expires_at timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.password_reset_otps r
     SET attempts = r.attempts + 1
   WHERE r.email = p_email AND r.attempts < p_max
  RETURNING r.otp_hash, r.expires_at;
$$;

-- 3) Limitador de peticiones persistido en Postgres (el limitador en memoria
--    no funciona en serverless: cada instancia tiene su propio contador).
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key          text        PRIMARY KEY,
  hits         integer     NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.rate_limits FROM anon, authenticated;

-- Ventana fija. Devuelve true si la peticion esta dentro del limite.
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_hits integer;
BEGIN
  INSERT INTO public.rate_limits AS rl (key, hits, window_start)
  VALUES (p_key, 1, now())
  ON CONFLICT (key) DO UPDATE
    SET hits = CASE
                 WHEN rl.window_start < now() - make_interval(secs => p_window_seconds) THEN 1
                 ELSE rl.hits + 1
               END,
        window_start = CASE
                 WHEN rl.window_start < now() - make_interval(secs => p_window_seconds) THEN now()
                 ELSE rl.window_start
               END
  RETURNING rl.hits INTO v_hits;

  RETURN v_hits <= p_limit;
END;
$$;

-- Solo el backend (service_role) puede ejecutar estas funciones.
REVOKE ALL ON FUNCTION public.take_signup_otp_attempt(text, integer)       FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.take_reset_otp_attempt(text, integer)        FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.check_rate_limit(text, integer, integer)     FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.take_signup_otp_attempt(text, integer)    TO service_role;
GRANT EXECUTE ON FUNCTION public.take_reset_otp_attempt(text, integer)     TO service_role;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer)  TO service_role;

-- 4) Limpieza de contadores viejos (solo la tabla rate_limits, que es nueva).
SELECT cron.schedule(
  'cleanup-rate-limits',
  '17 * * * *',
  $cron$DELETE FROM public.rate_limits WHERE window_start < now() - interval '1 day'$cron$
);
