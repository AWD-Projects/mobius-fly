/**
 * Paginated Flights Sitemap
 * Mobius Fly - Empty Leg Marketplace
 *
 * Generates paginated sitemaps for flight listings
 * Each sitemap contains up to 10,000 URLs
 * Handles route: /sitemap-flights-1.xml, /sitemap-flights-2.xml, etc
 */

import { SITE_CONFIG } from "@/lib/seo/metadata";

const FLIGHTS_PER_PAGE = 10000;

// Segment config for dynamic param
export const dynamicParams = true;

// ============================================================================
// TYPES
// ============================================================================

interface Flight {
  id: string;
  updatedAt: Date;
}

// ============================================================================
// DATA FETCHING
// ============================================================================

/**
 * Fetch paginated flights
 * TODO: Replace with actual database query
 */
async function getFlights(page: number): Promise<Flight[]> {
  // In production:
  // const offset = (page - 1) * FLIGHTS_PER_PAGE;
  // return await db.flights.findMany({
  //   where: { status: 'active' },
  //   select: { id: true, updatedAt: true },
  //   skip: offset,
  //   take: FLIGHTS_PER_PAGE,
  //   orderBy: { updatedAt: 'desc' }
  // });

  return []; // Mock
}

// ============================================================================
// ROUTE HANDLER
// ============================================================================

type RouteContext = {
  params: Promise<{ page: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { page } = await context.params;
    const pageNumber = parseInt(page, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return new Response("Invalid page number", { status: 400 });
    }

    const flights = await getFlights(pageNumber);

    // Generate sitemap XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${flights
  .map(
    (flight) => `  <url>
    <loc>${SITE_CONFIG.url}/flights/${flight.id}</loc>
    <lastmod>${flight.updatedAt.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating flights sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
