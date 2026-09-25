import { renderOg } from "@/lib/seo/og";
import { createPublicClient } from "@/lib/supabase/server";

export const alt = "Vuelo empty leg en jet privado";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await createPublicClient()
    .from("flights")
    .select(
      `departure_datetime, price_per_seat,
       dep:airports!flights_departure_airport_id_fkey (iata_code, city),
       arr:airports!flights_arrival_airport_id_fkey (iata_code, city)`,
    )
    .eq("id", id)
    .eq("is_visible", true)
    .single();

  const row = data as any;
  if (!row) {
    return renderOg({ eyebrow: "Vuelo empty leg", title: "Vuelos en jet privado" });
  }

  const date = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Mexico_City",
  }).format(new Date(row.departure_datetime));
  const price = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(Number(row.price_per_seat));

  return renderOg({
    eyebrow: `Empty leg · ${date}`,
    title: `${row.dep.iata_code} → ${row.arr.iata_code}`,
    subtitle: `${row.dep.city} a ${row.arr.city} · desde ${price} por asiento`,
  });
}
