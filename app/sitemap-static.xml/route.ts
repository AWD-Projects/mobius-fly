/**
 * Static Pages Sitemap
 * Mobius Fly - Empty Leg Marketplace
 *
 * Contains only static/evergreen pages
 * Separate from flight listings for better organization
 */

import { SITE_CONFIG } from "@/lib/seo/metadata";

const STATIC_PAGES = [
  { url: "/", priority: 1.0, changefreq: "daily" },
  { url: "/search", priority: 0.9, changefreq: "hourly" },
  { url: "/how-it-works", priority: 0.8, changefreq: "monthly" },
  { url: "/benefits", priority: 0.8, changefreq: "monthly" },
  { url: "/faq", priority: 0.7, changefreq: "weekly" },
  { url: "/contact", priority: 0.6, changefreq: "monthly" },
  { url: "/terms", priority: 0.3, changefreq: "yearly" },
  { url: "/privacy", priority: 0.3, changefreq: "yearly" },
];

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map(
  (page) => `  <url>
    <loc>${SITE_CONFIG.url}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
).join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
