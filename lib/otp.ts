import crypto from "crypto";

export const OTP_TTL_MINUTES = 10;

/** Generates a cryptographically random 6-digit string, zero-padded. */
export function generateOTP(): string {
    return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

/** SHA-256 hash of the plain OTP (stored in the cookie). */
export function hashOTP(otp: string): string {
    return crypto.createHash("sha256").update(otp).digest("hex");
}

/**
 * Constant-time comparison to prevent timing attacks.
 * Both hashes are 64-char hex strings, so lengths always match.
 */
export function verifyOTP(plain: string, storedHash: string): boolean {
    const expected = hashOTP(plain);
    try {
        return crypto.timingSafeEqual(
            Buffer.from(expected, "hex"),
            Buffer.from(storedHash, "hex"),
        );
    } catch {
        return false;
    }
}
