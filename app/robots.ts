/**
 * Robots.txt Configuration
 * Mobius Fly - Empty Leg Marketplace
 *
 * Controls search engine crawling
 * Protects private routes from indexation
 */

import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/search",
          "/flights/",
          "/how-it-works",
          "/benefits",
          "/faq",
          "/contact",
          "/terms",
          "/privacy",
        ],
        disallow: [
          // Authentication
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",

          // User areas
          "/dashboard",
          "/dashboard/*",
          "/profile",
          "/profile/*",
          "/settings",
          "/settings/*",

          // Owner areas
          "/owner",
          "/owner/*",
          "/onboarding",
          "/onboarding/*",

          // Transactional
          "/checkout",
          "/checkout/*",
          "/payment",
          "/payment/*",
          "/reserva",
          "/reserva/*",
          "/booking",
          "/booking/*",

          // System pages
          "/sistema",
          "/sistema/*",
          "/expired",
          "/denied",
          "/maintenance",
          "/offline",
          "/rate-limit",
          "/service-unavailable",
          "/unauthorized",
          "/forbidden",

          // API routes
          "/api",
          "/api/*",

          // Internal
          "/_next",
          "/_next/*",
          "/admin",
          "/admin/*",
        ],
        crawlDelay: 0,
      },
      // Aggressive bots - extra restrictions
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "Google-Extended",
          "anthropic-ai",
          "Claude-Web",
          "Omgilibot",
          "Omgili",
          "FacebookBot",
        ],
        disallow: ["/"],
      },
      // Allow Google Images for Open Graph
      {
        userAgent: "Googlebot-Image",
        allow: ["/og-image.jpg", "/api/og"],
        disallow: [],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
