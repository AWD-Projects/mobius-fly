"use client";

import * as React from "react";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { cn } from "@/lib/utils";
import type { RoundTripPair, FlightListItem } from "@/types/app.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function fmtDate(iso: string): string {
    const d = new Date(iso);
    return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

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

// ─── Leg sub-component ────────────────────────────────────────────────────────

const FlightLeg: React.FC<{ flight: FlightListItem }> = ({ flight }) => {
    const { departure_airport: dep, arrival_airport: arr } = flight;
    return (
        <div className="flex flex-col gap-4">
            {/* Route */}
            <div className="flex items-end gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[24px] sm:text-[28px] font-bold text-text leading-none">
                        {dep.iata_code}
                    </span>
                    <span className="text-caption text-muted">{dep.city}</span>
                </div>
                <ArrowRight className="text-muted mb-3 flex-shrink-0" size={18} />
                <div className="flex flex-col gap-1">
                    <span className="text-[24px] sm:text-[28px] font-bold text-text leading-none">
                        {arr.iata_code}
                    </span>
                    <span className="text-caption text-muted">{arr.city}</span>
                </div>
            </div>

            {/* Details */}
            <div className="flex items-center gap-3 flex-wrap">
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
                {flight.duration_minutes && (
                    <>
                        <span className="text-border text-small">|</span>
                        <div className="flex items-center gap-1.5 text-muted">
                            <Clock size={13} strokeWidth={1.5} />
                            <span className="text-caption">{fmtDuration(flight.duration_minutes)}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// ─── Component ────────────────────────────────────────────────────────────────

export interface FlightListCardRoundProps {
    pair: RoundTripPair;
    onSelect?: (pair: RoundTripPair) => void;
    className?: string;
}

export const FlightListCardRound: React.FC<FlightListCardRoundProps> = ({
    pair,
    onSelect,
    className,
}) => {
    const isReservable = pair.outbound.is_reservable && pair.inbound.is_reservable;
    const [isSelecting, setIsSelecting] = React.useState(false);

    const handleSelect = () => {
        if (isSelecting) return;
        setIsSelecting(true);
        onSelect?.(pair);
    };
    const totalPricePerSeat = pair.outbound.price_per_seat + pair.inbound.price_per_seat;

    return (
        <div
            className={cn(
                "w-full bg-surface rounded-md border border-border p-5 sm:p-6 flex flex-col gap-5",
                !isReservable && "opacity-70",
                className
            )}
        >
            {/* Ida badge */}
            <div className="flex items-center gap-2">
                <TypeBadge variant="info">
                    Ida · {fmtDate(pair.outbound.departure_datetime)}
                </TypeBadge>
                <TypeBadge variant="neutral">Redondo</TypeBadge>
            </div>

            {/* Outbound leg */}
            <FlightLeg flight={pair.outbound} />

            {/* Separator */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-caption text-muted font-medium">
                    Vuelta · {fmtDate(pair.inbound.departure_datetime)}
                </span>
                <div className="flex-1 h-px bg-border" />
            </div>

            {/* Inbound leg */}
            <FlightLeg flight={pair.inbound} />

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-border flex-wrap">
                <div className="flex flex-col gap-0.5">
                    <span className="text-caption text-muted font-medium">Total por persona</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-h3 font-bold text-text leading-none">
                            ${fmtPrice(totalPricePerSeat)}
                        </span>
                        <span className="text-caption text-muted">MXN</span>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={!isReservable || isSelecting}
                    isLoading={isSelecting}
                    onClick={handleSelect}
                >
                    {isSelecting ? "Seleccionando..." : "Seleccionar"}
                </Button>
            </div>
        </div>
    );
};
