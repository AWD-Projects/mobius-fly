/**
 * Sitemap Index Generator
 * Mobius Fly - Empty Leg Marketplace
 *
 * Creates sitemap index when total URLs exceed 50,000
 * Splits into multiple sitemaps:
 * - sitemap-static.xml (landing, FAQ, etc)
 * - sitemap-flights-1.xml, sitemap-flights-2.xml, etc
 *
 * Only needed when scaling to thousands of flights
 */

import { SITE_CONFIG } from "@/lib/seo/metadata";

const FLIGHTS_PER_SITEMAP = 10000;

// ============================================================================
// DATA FETCHING
// ============================================================================

/**
 * Get total count of active flights
 * TODO: Replace with actual database query
 */
async function getFlightCount(): Promise<number> {
  // In production:
  // return await db.flights.count({ where: { status: 'active' } });
  return 0; // Mock
}

// ============================================================================
// SITEMAP INDEX GENERATOR
// ============================================================================

export async function GET() {
  try {
    const flightCount = await getFlightCount();
    const flightSitemapCount = Math.ceil(flightCount / FLIGHTS_PER_SITEMAP);

    // Generate sitemap list
    const sitemaps: string[] = [
      `${SITE_CONFIG.url}/sitemap-static.xml`,
    ];

    // Add flight sitemaps if needed
    for (let i = 1; i <= flightSitemapCount; i++) {
      sitemaps.push(`${SITE_CONFIG.url}/sitemap-flights-${i}.xml`);
    }

    // Generate sitemap index XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap index:", error);
    return new Response("Error generating sitemap index", { status: 500 });
  }
}
