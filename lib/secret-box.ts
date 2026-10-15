import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { deriveKey } from "@/lib/server-secrets";

/**
 * AES-256-GCM encryption for short secrets that must sit in the database for a
 * few minutes (the password of a signup that is waiting for its email code).
 *
 * Format: v1.<iv>.<tag>.<ciphertext>  (all base64url)
 */
export function encryptSecret(plain: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", deriveKey("signup-payload"), iv);
    const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return ["v1", iv, tag, enc].map((x) => (typeof x === "string" ? x : x.toString("base64url"))).join(".");
}

export function decryptSecret(token: string): string {
    const [version, iv, tag, enc] = token.split(".");
    if (version !== "v1" || !iv || !tag || !enc) throw new Error("Invalid secret format");
    const decipher = createDecipheriv(
        "aes-256-gcm",
        deriveKey("signup-payload"),
        Buffer.from(iv, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(enc, "base64url")), decipher.final()]).toString("utf8");
}
