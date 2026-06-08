"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FlightDetailHero } from "./FlightDetailHero";
import { FlightInfoCard } from "./FlightInfoCard";
import { AircraftInfoCard } from "./AircraftInfoCard";
import { CrewInfoCard } from "./CrewInfoCard";
import { AdminControlCard } from "./AdminControlCard";
import { AlertBox } from "@/components/molecules/AlertBox";
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

const MX_TZ = "America/Mexico_City";

function formatDatetime(iso: string): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("es-MX", {
        timeZone: MX_TZ, day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function formatTime(iso: string): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString("es-MX", { timeZone: MX_TZ, hour: "2-digit", minute: "2-digit" });
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
    const [rejectedReason] = useState(data.rejected_reason);

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

            {statusCode === "PENDING_REVIEW" && (
                <div className="px-12 pt-6">
                    <AlertBox
                        variant="pending"
                        title="Tu vuelo está siendo validado"
                        description="Nuestro equipo está revisando los datos de tu vuelo. Estará listo y visible para compradores en no más de 48 horas."
                    />
                </div>
            )}

            {statusCode === "REJECTED" && (
                <div className="px-12 pt-6">
                    <AlertBox
                        variant="warning"
                        title="Tu vuelo fue rechazado"
                        description="Tu vuelo no pudo ser aprobado. Revisa el motivo y edita el vuelo para volver a enviarlo a revisión."
                    >
                        {rejectedReason && (
                            <p className="text-xs text-[#E65100]/80 mt-1">
                                <span className="font-semibold">Motivo:</span> {rejectedReason}
                            </p>
                        )}
                    </AlertBox>
                </div>
            )}

            <div className="px-12 py-10 flex gap-10">
                {/* Left Column */}
                <div className="flex-1 flex flex-col gap-8">
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
                        flightPlanUrl={data.flight_plan_url}
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
                        isVisible={data.is_visible}
                        onStatusChange={setStatusCode}
                    />
                </div>
            </div>
        </div>
    );
}
