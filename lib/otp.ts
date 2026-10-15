import crypto from "crypto";
import { deriveKey } from "@/lib/server-secrets";

export const OTP_TTL_MINUTES = 10;

/** Max wrong guesses allowed per issued OTP (enforced atomically in the DB). */
export const MAX_OTP_ATTEMPTS = 5;

/** Emails are keyed in lowercase everywhere, so case variants can't multiply attempts. */
export function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

/** Generates a cryptographically random 6-digit string, zero-padded. */
export function generateOTP(): string {
    return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

/**
 * Keyed hash (HMAC-SHA256) of the OTP, bound to the email.
 * A 6-digit code has only 1M possibilities, so a plain SHA-256 can be reversed
 * instantly if the hash ever leaks. The server-side key makes that impossible
 * without also holding the key.
 */
export function hashOTP(otp: string, email: string): string {
    return crypto
        .createHmac("sha256", deriveKey("otp-hash"))
        .update(`${normalizeEmail(email)}:${otp}`)
        .digest("hex");
}

/**
 * Constant-time comparison to prevent timing attacks.
 * Both hashes are 64-char hex strings, so lengths always match.
 */
export function verifyOTP(plain: string, storedHash: string, email: string): boolean {
    const expected = hashOTP(plain, email);
    try {
        return crypto.timingSafeEqual(
            Buffer.from(expected, "hex"),
            Buffer.from(storedHash, "hex"),
        );
    } catch {
        return false;
    }
}
