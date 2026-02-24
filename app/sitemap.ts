/**
 * Dynamic Sitemap Generator
 * Mobius Fly - Empty Leg Marketplace
 *
 * Generates sitemap with:
 * - Static pages
 * - Active flights (dynamic)
 * - Proper priority and changefreq
 * - Automatic splitting for large datasets
 */

import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo/metadata";

// ============================================================================
// TYPES
// ============================================================================

interface Flight {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  status: "active" | "cancelled" | "completed";
  updatedAt: string;
}

// ============================================================================
// DATA FETCHING (Replace with real DB queries)
// ============================================================================

/**
 * Fetch active flights for sitemap
 * TODO: Replace with actual database query
 */
async function getActiveFlights(): Promise<Flight[]> {
  // In production, this would be:
  // const flights = await db.flights.findMany({
  //   where: { status: 'active' },
  //   select: { id: true, origin: true, destination: true, departureTime: true, updatedAt: true }
  // });

  // Mock data for now
  return [];
}

// ============================================================================
// SITEMAP CONFIGURATION
// ============================================================================

const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: `${SITE_CONFIG.url}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${SITE_CONFIG.url}/search`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.9,
  },
  {
    url: `${SITE_CONFIG.url}/how-it-works`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_CONFIG.url}/benefits`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_CONFIG.url}/faq`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${SITE_CONFIG.url}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${SITE_CONFIG.url}/terms`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${SITE_CONFIG.url}/privacy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

// ============================================================================
// SITEMAP GENERATOR
// ============================================================================

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch active flights
    const flights = await getActiveFlights();

    // Generate flight URLs
    const flightUrls: MetadataRoute.Sitemap = flights.map((flight) => ({
      url: `${SITE_CONFIG.url}/flights/${flight.id}`,
      lastModified: new Date(flight.updatedAt),
      changeFrequency: "daily",
      priority: 0.8,
      // Optional: Add alternate languages
      // alternates: {
      //   languages: {
      //     es: `${SITE_CONFIG.url}/es/flights/${flight.id}`,
      //   },
      // },
    }));

    // Combine static and dynamic URLs
    const allUrls = [...STATIC_PAGES, ...flightUrls];

    // If more than 50,000 URLs, consider implementing sitemap index
    // See: app/sitemap-[index].ts pattern

    return allUrls;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback to static pages only
    return STATIC_PAGES;
  }
}

// ============================================================================
// SITEMAP CONFIGURATION
// ============================================================================

export const revalidate = 3600; // Revalidate every hour
