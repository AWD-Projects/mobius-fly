-- Temporary table for pending signups awaiting OTP verification.
-- Records are upserted on each signup/resend and deleted after successful verification.
-- TTL is enforced at the application layer (expiresAt inside payload + expires_at column).

CREATE TABLE IF NOT EXISTS signup_otps (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    email       text        NOT NULL UNIQUE,
    otp_hash    text        NOT NULL,
    expires_at  timestamptz NOT NULL,
    -- All other pending signup data (firstName, lastName, password, storagePath, …)
    payload     jsonb       NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- Only the service-role key should touch this table.
ALTER TABLE signup_otps DISABLE ROW LEVEL SECURITY;

-- Index for cleanup queries (delete expired rows).
CREATE INDEX IF NOT EXISTS signup_otps_expires_at_idx ON signup_otps (expires_at);
