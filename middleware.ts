/**
 * Middleware - Session Refresh, Route Protection & SEO Security
 * Mobius Fly - Empty Leg Marketplace
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Routes only accessible when NOT authenticated ─────────────────────────────
const AUTH_ONLY_PATTERNS = [
    /^\/login/,
    /^\/register/,
];

// ── Routes that require an active session ────────────────────────────────────
const PROTECTED_PATTERNS = [
    /^\/my-trips/,
    /^\/owner/,
    /^\/dashboard/,
    /^\/profile/,
    /^\/settings/,
    /^\/checkout/,
    /^\/payment/,
    /^\/reserva/,
    /^\/booking/,
    /^\/onboarding/,
];

// ── Routes that should never be indexed ──────────────────────────────────────
const PRIVATE_ROUTE_PATTERNS = [
    ...AUTH_ONLY_PATTERNS,
    ...PROTECTED_PATTERNS,
    /^\/forgot-password/,
    /^\/reset-password/,
    /^\/sistema/,
    /^\/expired/,
    /^\/denied/,
    /^\/maintenance/,
    /^\/offline/,
    /^\/rate-limit/,
    /^\/service-unavailable/,
    /^\/unauthorized/,
    /^\/forbidden/,
    /^\/empty/,
    /^\/api/,
];

// ============================================================================
// MIDDLEWARE
// ============================================================================

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── 1. Supabase SSR session refresh ───────────────────────────────────────
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    // Refresh session — must be called before any redirect logic
    const { data: { user } } = await supabase.auth.getUser();

    // ── 2. Route protection ───────────────────────────────────────────────────
    const isAuthOnly = AUTH_ONLY_PATTERNS.some((p) => p.test(pathname));
    const isProtected = PROTECTED_PATTERNS.some((p) => p.test(pathname));

    // Logged-in user trying to access login/register → redirect to their area
    if (isAuthOnly && user) {
        const role = user.user_metadata?.role as string | undefined;
        const dest = role === "OWNER" ? "/owner/dashboard" : "/my-trips";
        return NextResponse.redirect(new URL(dest, request.url));
    }

    // Unauthenticated user trying to access a protected route → redirect to login
    if (isProtected && !user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ── 3. Security headers ───────────────────────────────────────────────────
    const isPrivate = PRIVATE_ROUTE_PATTERNS.some((p) => p.test(pathname));

    supabaseResponse.headers.set(
        "X-Robots-Tag",
        isPrivate ? "noindex, nofollow, noarchive, nosnippet" : "index, follow",
    );
    supabaseResponse.headers.set("X-Frame-Options", "SAMEORIGIN");
    supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");
    supabaseResponse.headers.set(
        "Referrer-Policy",
        "strict-origin-when-cross-origin",
    );

    return supabaseResponse;
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};
