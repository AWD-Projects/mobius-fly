import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdMultiple } from "@/components/seo/JsonLd";
import { getFlightGraphSchema, getBreadcrumbSchema } from "@/lib/seo/json-ld";
import { getFlightMetadata } from "@/lib/seo/metadata";
import { getFlightById } from "@/app/actions/flights";
import { FlightDetailContent } from "./_components/FlightDetailContent";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ passengers?: string }>;
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
    const { id } = await params;
    const f = await getFlightById(id);
    if (!f) return { title: "Vuelo no disponible", robots: { index: false, follow: false } };

    return getFlightMetadata({
        id,
        originCity: f.departure_airport.city,
        originCode: f.departure_airport.iata_code,
        destinationCity: f.arrival_airport.city,
        destinationCode: f.arrival_airport.iata_code,
        departureISO: f.departure_datetime,
        pricePerSeat: f.price_per_seat,
        availableSeats: f.available_seats,
        aircraft: `${f.aircraft.manufacturer} ${f.aircraft.model}`.trim(),
        indexable: f.is_reservable && new Date(f.departure_datetime) > new Date(),
    });
}

export default async function FlightDetailPage({ params, searchParams }: Props) {
    const { id } = await params;
    const { passengers } = await searchParams;

    const flightDetail = await getFlightById(id);

    if (!flightDetail) {
        notFound();
    }

    const f = flightDetail;
    const route = `${f.departure_airport.city} a ${f.arrival_airport.city}`;

    return (
        <>
        <JsonLdMultiple
            schemas={[
                getBreadcrumbSchema([
                    { name: "Inicio", url: "/" },
                    { name: "Vuelos", url: "/flights" },
                    { name: route, url: `/flights/${id}` },
                ]),
                getFlightGraphSchema({
                    id,
                    flightCode: f.flight_code,
                    origin: { code: f.departure_airport.iata_code, name: f.departure_airport.name, city: f.departure_airport.city, state: f.departure_airport.state, country: f.departure_airport.country },
                    destination: { code: f.arrival_airport.iata_code, name: f.arrival_airport.name, city: f.arrival_airport.city, state: f.arrival_airport.state, country: f.arrival_airport.country },
                    departureISO: f.departure_datetime,
                    arrivalISO: f.arrival_datetime,
                    durationMinutes: f.duration_minutes,
                    aircraft: `${f.aircraft.manufacturer} ${f.aircraft.model}`.trim(),
                    pricePerSeat: f.price_per_seat,
                    currency: f.currency,
                    availableSeats: f.available_seats,
                    photos: f.aircraft.photos,
                }),
            ]}
        />
        <Suspense>
            <FlightDetailContent
                flightId={id}
                flightDetail={flightDetail}
                initialPassengers={Math.max(1, parseInt(passengers ?? "1") || 1)}
            />
        </Suspense>
        </>
    );
}
