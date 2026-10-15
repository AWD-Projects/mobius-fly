/**
 * Persistent rate limiter backed by Postgres (public.check_rate_limit).
 *
 * Unlike lib/rate-limit.ts (in-memory, per serverless instance), the counter
 * lives in the database, so it holds across instances and cold starts.
 * Fixed window. Fails CLOSED: if the limiter cannot be reached the request is
 * denied rather than allowed through.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export function clientIp(req: NextRequest): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}

/** Returns true while `key` is within `limit` hits per `windowSeconds`. */
export async function allowed(
    key: string,
    limit: number,
    windowSeconds: number,
): Promise<boolean> {
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("check_rate_limit", {
        p_key:            key,
        p_limit:          limit,
        p_window_seconds: windowSeconds,
    });

    if (error) {
        console.error("[rate-limit-db] check_rate_limit failed:", error.message);
        return false;
    }
    return data === true;
}

export function tooManyRequests(retryAfterSeconds = 900): NextResponse {
    return NextResponse.json(
        { error: "Demasiados intentos. Espera unos minutos e intenta de nuevo." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
}
