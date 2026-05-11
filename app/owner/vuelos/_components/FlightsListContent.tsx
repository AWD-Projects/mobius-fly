"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { FlightsFilterBar, FlightsFilters } from "./FlightsFilterBar";
import { FlightsTable, Flight } from "./FlightsTable";
import { FlightsPagination } from "./FlightsPagination";
import { toast } from "@/components/atoms/Toast";
import { deleteFlight } from "@/app/actions/flights";
import type { OwnerFlightListItem } from "@/app/actions/flights";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    flights: OwnerFlightListItem[];
    ownerId: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, Flight["status"]> = {
    SCHEDULED:  "scheduled",
    DELAYED:    "delayed",
    IN_FLIGHT:  "in-flight",
    ON_TIME:    "confirmed",
    COMPLETED:  "completed",
    CANCELLED:  "cancelled",
};

function formatDate(iso: string): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("es-MX", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
}

function toDisplayFlight(item: OwnerFlightListItem): Flight {
    return {
        id:       item.id,
        route:    `${item.departure_iata} → ${item.arrival_iata}`,
        date:     formatDate(item.departure_datetime),
        aircraft: item.aircraft_model,
        type:     item.flight_type === "ROUND_TRIP" ? "personal" : "charter",
        status:   STATUS_MAP[item.status_code] ?? "scheduled",
        capacity: `${item.total_seats - item.available_seats}/${item.total_seats}`,
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FlightsListContent({ flights: initialFlights, ownerId }: Props) {
    const router = useRouter();
    const [flightList, setFlightList] = useState<OwnerFlightListItem[]>(initialFlights);
    const [filters, setFilters] = useState<FlightsFilters>({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleDelete = async (id: string) => {
        const { error } = await deleteFlight(id, ownerId);
        if (error) {
            toast.error("No se pudo eliminar", error);
        } else {
            setFlightList((prev) => prev.filter((f) => f.id !== id));
            toast.success("Vuelo eliminado", "El vuelo fue eliminado correctamente.");
        }
    };

    const display = flightList.map(toDisplayFlight);

    const filtered = display.filter((f) => {
        if (filters.origin      && !f.route.toLowerCase().startsWith(filters.origin.toLowerCase())) return false;
        if (filters.destination && !f.route.toLowerCase().endsWith(filters.destination.toLowerCase())) return false;
        if (filters.aircraft    && !f.aircraft.toLowerCase().includes(filters.aircraft.toLowerCase())) return false;
        if (filters.type        && f.type   !== filters.type)   return false;
        if (filters.status      && f.status !== filters.status) return false;
        if (filters.date) {
            const raw = flightList.find((r) => r.id === f.id);
            if (raw && !raw.departure_datetime.startsWith(filters.date)) return false;
        }
        return true;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start      = (currentPage - 1) * itemsPerPage;
    const paginated  = filtered.slice(start, start + itemsPerPage);

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <h1 className="text-[26px] font-semibold text-text">Mis vuelos</h1>
                <p className="text-small text-muted mt-2">Resumen operativo de tu flota</p>
            </div>

            <FlightsFilterBar
                filters={filters}
                onFiltersChange={(f) => { setFilters(f); setCurrentPage(1); }}
                onClearFilters={() => { setFilters({}); setCurrentPage(1); }}
            />

            <div className="px-12 py-0 flex flex-col gap-[18px]">
                <div className="flex items-center justify-between">
                    <h2 className="text-small font-semibold text-text">Vuelos próximos</h2>
                    <Button
                        onClick={() => router.push("/owner/vuelos/nuevo")}
                        variant="primary"
                        className="h-10 px-4 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo vuelo
                    </Button>
                </div>

                <FlightsTable
                    flights={paginated}
                    onView={(id) => router.push(`/owner/vuelos/${id}`)}
                    onEdit={(id) => router.push(`/owner/vuelos/${id}/edit`)}
                    onDelete={handleDelete}
                />

                <FlightsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filtered.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}
