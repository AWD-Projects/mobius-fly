"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FlightDetailHero } from "./FlightDetailHero";
import { FlightInfoCard } from "./FlightInfoCard";
import { AircraftInfoCard } from "./AircraftInfoCard";
import { CrewInfoCard } from "./CrewInfoCard";
import { AdminControlCard } from "./AdminControlCard";
import type { OwnerFlightDetail } from "@/app/actions/flights";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    data:    OwnerFlightDetail;
    ownerId: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_LABEL: Record<string, string> = {
    CAPTAIN:          "Capitán",
    FIRST_OFFICER:    "Copiloto",
    FLIGHT_ATTENDANT: "TCP / Sobrecargo",
};

function formatDatetime(iso: string): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("es-MX", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function formatTime(iso: string): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

function diffMinutes(from: string, to: string): string {
    const mins = Math.round((new Date(to).getTime() - new Date(from).getTime()) / 60000);
    if (mins <= 0) return "";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `Duración: ${h}h ${m > 0 ? `${m}min` : ""}`.trim() : `Duración: ${m}min`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FlightDetailContent({ data, ownerId }: Props) {
    const router = useRouter();
    const [statusCode, setStatusCode] = useState(data.status_code);

    const depAirport = data.departure_airport;
    const arrAirport = data.arrival_airport;

    const flightCode  = data.flight_code ?? data.id.slice(0, 8).toUpperCase();
    const soldSeats   = data.total_seats - data.available_seats;
    const priceFormatted = data.price_per_seat.toLocaleString("es-MX", {
        style: "currency", currency: "MXN",
    });

    const aircraftStatus = (data.aircraft?.status ?? "ACTIVE").toLowerCase() as
        "active" | "maintenance" | "inactive";

    const crewForCard = data.crew.map((c) => ({
        id:       c.id,
        name:     `${c.first_name} ${c.last_name}`,
        role:     ROLE_LABEL[c.role_code] ?? c.role_code,
        licenses: c.license_number ? [c.license_number] : [],
    }));

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            <FlightDetailHero
                flightCode={flightCode}
                origin={depAirport.city}
                destination={arrAirport.city}
                date={formatDatetime(data.departure_datetime)}
                statusCode={statusCode}
            />

            <div className="px-12 py-10 flex gap-10">
                {/* Left Column */}
                <div className="flex-1 flex flex-col gap-8" style={{ maxWidth: "856px" }}>
                    <FlightInfoCard
                        flightType={data.flight_type === "ROUND_TRIP" ? "Redondo" : "Sencillo"}
                        origin={{
                            city:    `${depAirport.city}`,
                            airport: `${depAirport.name} (${depAirport.iata_code})`,
                        }}
                        destination={{
                            city:    `${arrAirport.city}`,
                            airport: `${arrAirport.name} (${arrAirport.iata_code})`,
                        }}
                        fbo={{
                            name:     data.departure_fbo_name ?? "—",
                            location: data.arrival_fbo_name   ?? "—",
                        }}
                        schedule={{
                            time:     `${formatTime(data.departure_datetime)} → ${formatTime(data.arrival_datetime)}`,
                            duration: diffMinutes(data.departure_datetime, data.arrival_datetime),
                        }}
                    />

                    {data.aircraft && (
                        <AircraftInfoCard
                            model={data.aircraft.manufacturer
                                ? `${data.aircraft.manufacturer} ${data.aircraft.model}`
                                : data.aircraft.model}
                            registration={data.aircraft.tail_number}
                            base="—"
                            capacity={`${data.aircraft.seats} pasajeros`}
                            type="Aeronave"
                            status={aircraftStatus}
                            onViewAircraft={() => router.push(`/owner/aeronaves/${data.aircraft!.id}`)}
                        />
                    )}

                    {crewForCard.length > 0 && (
                        <CrewInfoCard
                            crew={crewForCard}
                            onViewCrew={() => router.push("/owner/tripulacion")}
                        />
                    )}
                </div>

                {/* Right Column */}
                <div style={{ width: "400px" }}>
                    <AdminControlCard
                        flightId={data.id}
                        ownerId={ownerId}
                        statusCode={statusCode}
                        totalSeats={data.total_seats}
                        soldSeats={soldSeats}
                        availableSeats={data.available_seats}
                        pricePerSeat={priceFormatted}
                        passengers={data.passengers}
                        onStatusChange={setStatusCode}
                    />
                </div>
            </div>
        </div>
    );
}
