/**
 * sitemap.xml
 *
 * Static public pages + every visible, upcoming flight (with aircraft photos).
 * Revalidated hourly. Lists only URLs that return 200 and are indexable.
 */
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/config";
import { createPublicClient } from "@/lib/supabase/server";

export const revalidate = 3600;

// Bump when the page content materially changes (a stable lastmod is a trust
// signal; `new Date()` on every request teaches Google to ignore it).
const CONTENT_UPDATED = new Date("2026-03-17");

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: absoluteUrl("/"), lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 1 },
  { url: absoluteUrl("/flights"), lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  { url: absoluteUrl("/terms"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/privacy"), lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.3 },
];

async function getFlightEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("flights")
      .select("id, departure_datetime, updated_at, aircraft:aircrafts!flights_aircraft_id_fkey (photos)")
      .eq("is_visible", true)
      .gte("departure_datetime", new Date().toISOString())
      .gt("available_seats", 0)
      .order("departure_datetime", { ascending: true })
      .limit(5000);

    if (error || !data) {
      if (error) console.error("[sitemap] flights query:", error.message);
      return [];
    }

    return data.map((row: any) => ({
      url: absoluteUrl(`/flights/${row.id}`),
      lastModified: new Date(row.updated_at ?? row.departure_datetime),
      changeFrequency: "daily" as const,
      priority: 0.8,
      images: ((row.aircraft?.photos as string[] | null) ?? []).slice(0, 3),
    }));
  } catch (err) {
    console.error("[sitemap] failed:", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [...STATIC_PAGES, ...(await getFlightEntries())];
}

