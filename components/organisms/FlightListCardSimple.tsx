"use client";

import * as React from "react";
import { ArrowRight, Plane, Clock } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { cn } from "@/lib/utils";
import type { FlightListItem } from "@/types/app.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function fmtDatetime(iso: string): string {
    const d = new Date(iso);
    const h = d.getUTCHours();
    const m = d.getUTCMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} · ${h % 12 || 12}:${m} ${ampm}`;
}

function fmtDuration(minutes: number | null): string {
    if (!minutes) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function seatsColor(available: number): string {
    if (available === 0) return "text-error";
    if (available <= 3) return "text-warning";
    return "text-success";
}

function fmtPrice(n: number): string {
    return n.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ─── Component ───────────────────────────────────────────────────────────────

export interface FlightListCardSimpleProps {
    flight: FlightListItem;
    onSelect?: (flight: FlightListItem) => void;
    className?: string;
}

export const FlightListCardSimple: React.FC<FlightListCardSimpleProps> = ({
    flight,
    onSelect,
    className,
}) => {
    const { departure_airport: dep, arrival_airport: arr } = flight;

    return (
        <div
            className={cn(
                "w-full bg-surface rounded-md border border-border p-5 sm:p-6 flex flex-col gap-5",
                !flight.is_reservable && "opacity-70",
                className
            )}
        >
            {/* Route */}
            <div className="flex items-end gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[28px] sm:text-[32px] font-bold text-text leading-none">
                        {dep.iata_code}
                    </span>
                    <span className="text-caption text-muted">{dep.city}</span>
                </div>
                <ArrowRight className="text-muted mb-3 flex-shrink-0" size={20} />
                <div className="flex flex-col gap-1">
                    <span className="text-[28px] sm:text-[32px] font-bold text-text leading-none">
                        {arr.iata_code}
                    </span>
                    <span className="text-caption text-muted">{arr.city}</span>
                </div>
            </div>

            {/* Details row */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex flex-col gap-0.5">
                    <span className="text-caption text-muted font-medium">Salida</span>
                    <span className="text-small text-text font-normal">
                        {fmtDatetime(flight.departure_datetime)}
                    </span>
                </div>
                <span className="text-border text-small">|</span>
                <div className="flex flex-col gap-0.5">
                    <span className="text-caption text-muted font-medium">Disponible</span>
                    <span className={cn("text-small font-semibold", seatsColor(flight.available_seats))}>
                        {flight.available_seats === 0
                            ? "Sin asientos"
                            : `${flight.available_seats} asiento${flight.available_seats !== 1 ? "s" : ""}`}
                    </span>
                </div>
                <span className="text-border text-small">|</span>
                <div className="flex flex-col gap-0.5">
                    <span className="text-caption text-muted font-medium">Tipo</span>
                    <TypeBadge variant="neutral">Sencillo</TypeBadge>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 text-muted">
                    <div className="flex items-center gap-1.5">
                        <Plane size={14} strokeWidth={1.5} />
                        <span className="text-caption font-normal truncate max-w-[140px]">
                            {flight.aircraft_photo
                                ? `${flight.flight_code.includes("MF") ? "Jet ejecutivo" : "Aeronave privada"}`
                                : "Aeronave privada"}
                        </span>
                    </div>
                    {flight.duration_minutes && (
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} strokeWidth={1.5} />
                            <span className="text-caption font-normal">
                                {fmtDuration(flight.duration_minutes)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="text-h3 font-bold text-text leading-none">
                            ${fmtPrice(flight.price_per_seat)}
                        </span>
                        <span className="text-caption text-muted">MXN / asiento</span>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={!flight.is_reservable}
                        onClick={() => onSelect?.(flight)}
                    >
                        Seleccionar
                    </Button>
                </div>
            </div>
        </div>
    );
};
