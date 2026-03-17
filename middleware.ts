/**
 * Middleware - SEO Security & Route Protection
 * Mobius Fly - Empty Leg Marketplace
 *
 * Adds X-Robots-Tag headers to private routes
 * Prevents accidental indexation of sensitive pages
 * Refreshes Supabase auth session on every request
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ============================================================================
// PRIVATE ROUTES CONFIGURATION
// ============================================================================

const PRIVATE_ROUTE_PATTERNS = [
  // Authentication
  /^\/login/,
  /^\/register/,
  /^\/forgot-password/,
  /^\/reset-password/,

  // User areas
  /^\/dashboard/,
  /^\/profile/,
  /^\/settings/,
  /^\/my-trips/,

  // Owner areas
  /^\/owner/,
  /^\/onboarding/,

  // Transactional
  /^\/checkout/,
  /^\/payment/,
  /^\/reserva/,
  /^\/booking/,

  // System pages
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

  // API routes
  /^\/api/,
];

// ============================================================================
// MIDDLEWARE
// ============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh Supabase session so it doesn't expire mid-session
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

  // Refresh session — do not remove this line
  await supabase.auth.getUser();

  // Check if route should be protected
  const isPrivateRoute = PRIVATE_ROUTE_PATTERNS.some((pattern) =>
    pattern.test(pathname),
  );

  // Add security headers for private routes
  if (isPrivateRoute) {
    supabaseResponse.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive, nosnippet",
    );
    supabaseResponse.headers.set("X-Frame-Options", "SAMEORIGIN");
    supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");
    supabaseResponse.headers.set(
      "Referrer-Policy",
      "strict-origin-when-cross-origin",
    );
    return supabaseResponse;
  }

  // General security headers for public routes
  supabaseResponse.headers.set("X-Robots-Tag", "index, follow");
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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
