/**
 * robots.txt
 *
 * Only disallow what must never be crawled (APIs, authenticated areas,
 * transactional steps). Pages that are merely "noindex" (login, etc.) stay
 * crawlable so Google can actually see the noindex directive.
 */
import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";

const PRIVATE_PATHS = [
  "/api/",
  "/owner/",
  "/my-trips/",
  "/thank-you",
  "/flights/*/passengers",
  "/flights/*/payment",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      // Model-training crawlers: opted out. AI *search/answer* bots
      // (OAI-SearchBot, PerplexityBot, ClaudeBot user fetches) fall under "*".
      {
        userAgent: ["GPTBot", "CCBot", "Google-Extended", "anthropic-ai", "Omgilibot"],
        disallow: "/",
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
