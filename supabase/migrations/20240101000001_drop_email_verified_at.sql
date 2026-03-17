-- email_verified_at is redundant: auth.users.email_confirmed_at is always set
-- at the exact same moment the account is created (OTP verified first).
ALTER TABLE user_profiles DROP COLUMN IF EXISTS email_verified_at;
