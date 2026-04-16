// ─────────────────────────────────────────────────────────────────────────────
// Flight Code Generator
// Format: MF-{OWN4}-{YYMMDD}-{RND5}
//   MF     → Mobius Fly prefix
//   OWN4   → Base36 hash of owner UUID, last 4 chars (deterministic per owner)
//   YYMMDD → Flight departure date
//   RND5   → Random Base36, 5 chars (collision resistance within a day)
//
// Generation is pure in-memory — no DB queries needed.
// Uniqueness is enforced by the `flight_code` UNIQUE constraint in the DB;
// callers should retry on 23505 (unique_violation) if needed.
// ─────────────────────────────────────────────────────────────────────────────

const BASE36_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Converts a UUID string to a 4-char uppercase Base36 hash. */
function ownerHashBase36(ownerId: string): string {
    const hex = ownerId.replace(/-/g, "");
    const n = BigInt("0x" + hex);
    return n.toString(36).slice(-4).toUpperCase().padStart(4, "0");
}

/** Generates a cryptographically random Base36 string of the given length. */
function randomBase36(length: number): string {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map((b) => BASE36_CHARS[b % 36])
        .join("");
}

/**
 * Generates a flight code in the format MF-{OWN4}-{YYMMDD}-{RND5}.
 *
 * @param ownerId       UUID of the owner (from auth session — no DB call needed)
 * @param departureDate Departure date of the flight
 * @returns             e.g. "MF-K3X9-260415-A7B2Q"
 */
export function generateFlightCode(ownerId: string, departureDate: Date): string {
    const own4 = ownerHashBase36(ownerId);

    const yy = String(departureDate.getFullYear()).slice(-2);
    const mm = String(departureDate.getMonth() + 1).padStart(2, "0");
    const dd = String(departureDate.getDate()).padStart(2, "0");
    const datePart = `${yy}${mm}${dd}`;

    const rnd5 = randomBase36(5);

    return `MF-${own4}-${datePart}-${rnd5}`;
}
