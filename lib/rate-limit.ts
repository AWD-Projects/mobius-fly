/**
 * In-memory sliding-window rate limiter.
 *
 * ⚠️  TEMPORARY — safe for single-instance deployments (dev / staging).
 * Replace with @upstash/ratelimit + @upstash/redis before scaling to
 * multiple serverless workers in production.
 */

import { NextRequest, NextResponse } from "next/server";

interface Bucket {
    timestamps: number[];
}

const store = new Map<string, Bucket>();

function getIP(req: NextRequest): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        req.headers.get("x-real-ip") ??
        "anonymous"
    );
}

export function rateLimit(options: { limit: number; windowMs: number }) {
    return function check(req: NextRequest): NextResponse | null {
        const ip = getIP(req);
        const key = `${req.nextUrl.pathname}::${ip}`;
        const now = Date.now();
        const windowStart = now - options.windowMs;

        const bucket = store.get(key) ?? { timestamps: [] };

        bucket.timestamps = bucket.timestamps.filter((t) => t > windowStart);

        if (bucket.timestamps.length >= options.limit) {
            const retryAfter = Math.ceil(options.windowMs / 1000);
            return NextResponse.json(
                { error: "Demasiadas solicitudes. Por favor espera un momento e intenta de nuevo." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(retryAfter),
                        "X-RateLimit-Limit": String(options.limit),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": String(Math.ceil((windowStart + options.windowMs) / 1000)),
                    },
                },
            );
        }

        bucket.timestamps.push(now);
        store.set(key, bucket);
        return null;
    };
}
