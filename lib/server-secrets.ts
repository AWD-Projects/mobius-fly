import { hkdfSync } from "crypto";

/**
 * Derives a purpose-bound 32-byte key from a server-side secret.
 *
 * Uses OTP_ENCRYPTION_KEY when set; otherwise falls back to the Supabase
 * service-role key, which already exists only on the server. Different
 * `purpose` strings yield independent keys, so a key used to hash OTPs is
 * never the key used to encrypt signup payloads.
 *
 * Server-only: never import this from a client component.
 */
export function deriveKey(purpose: string): Buffer {
    const secret = process.env.OTP_ENCRYPTION_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!secret) {
        throw new Error("Missing server secret (OTP_ENCRYPTION_KEY or SUPABASE_SERVICE_ROLE_KEY)");
    }
    return Buffer.from(hkdfSync("sha256", secret, "mobius-fly", purpose, 32));
}
