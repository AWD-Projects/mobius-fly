/**
 * Middleware - SEO Security & Route Protection
 * Mobius Fly - Empty Leg Marketplace
 *
 * Adds X-Robots-Tag headers to private routes
 * Prevents accidental indexation of sensitive pages
 */

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route should be protected
  const isPrivateRoute = PRIVATE_ROUTE_PATTERNS.some((pattern) =>
    pattern.test(pathname)
  );

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Add security headers for private routes
  if (isPrivateRoute) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Add noindex headers
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");

    // Additional security headers
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
  }

  // Add security headers to all responses
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // General security headers
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Allow indexing for public routes
  if (!isPrivateRoute) {
    response.headers.set("X-Robots-Tag", "index, follow");
  }

  return response;
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
