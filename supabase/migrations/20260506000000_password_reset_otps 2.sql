-- Temporary table for password reset OTPs.
-- Records are upserted on each request and deleted after successful reset.
-- TTL is enforced at the application layer via expires_at.

CREATE TABLE IF NOT EXISTS password_reset_otps (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    email       text        NOT NULL UNIQUE,
    otp_hash    text        NOT NULL,
    expires_at  timestamptz NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE password_reset_otps DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS password_reset_otps_expires_at_idx ON password_reset_otps (expires_at);
