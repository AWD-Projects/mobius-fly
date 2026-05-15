"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { FlightsFilterBar, FlightsFilters } from "./FlightsFilterBar";
import { FlightsTable, Flight } from "./FlightsTable";
import { FlightsPagination } from "./FlightsPagination";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { toast } from "@/components/atoms/Toast";
import { deleteFlight } from "@/app/actions/flights";
import type { OwnerFlightListItem } from "@/app/actions/flights";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    flights:     OwnerFlightListItem[];
    ownerId:     string;
    hasAircraft: boolean;
    hasCaptain:  boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, Flight["status"]> = {
    SCHEDULED:      "scheduled",
    DELAYED:        "delayed",
    IN_FLIGHT:      "in-flight",
    ON_TIME:        "confirmed",
    COMPLETED:      "completed",
    CANCELLED:      "cancelled",
    PENDING_REVIEW: "pending_review",
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

export function FlightsListContent({ flights: initialFlights, ownerId, hasAircraft, hasCaptain }: Props) {
    const router = useRouter();
    const [flightList, setFlightList] = useState<OwnerFlightListItem[]>(initialFlights);
    const [filters, setFilters] = useState<FlightsFilters>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const itemsPerPage = 5;

    const handleDeleteRequest = (id: string) => setConfirmDeleteId(id);

    const handleDeleteConfirm = async () => {
        if (!confirmDeleteId) return;
        setIsDeleting(true);
        const { error, notifiedPassengers } = await deleteFlight(confirmDeleteId, ownerId);
        setIsDeleting(false);
        setConfirmDeleteId(null);
        if (error) {
            toast.error("No se pudo eliminar", error);
        } else {
            setFlightList((prev) => prev.filter((f) => f.id !== confirmDeleteId));
            if (notifiedPassengers > 0) {
                toast.success(
                    "Vuelo cancelado",
                    `Se notificó a ${notifiedPassengers} ${notifiedPassengers === 1 ? "pasajero" : "pasajeros"} por correo.`,
                );
            } else {
                toast.success("Vuelo eliminado", "El vuelo fue eliminado correctamente.");
            }
        }
    };

    const canCreate = hasAircraft && hasCaptain;

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
                {!canCreate && (
                    <div className="flex items-start gap-3.5 px-5 py-4 rounded-xl bg-[#FFF3E0] border border-[#FB8C00]/25">
                        <AlertCircle className="w-4 h-4 text-[#E65100] shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-semibold text-[#E65100]">Completa tu perfil para crear vuelos</p>
                            <p className="text-xs text-[#E65100]/80">
                                Para publicar un vuelo necesitas tener al menos:
                            </p>
                            <ul className="flex flex-col gap-1">
                                {!hasAircraft && (
                                    <li className="flex items-center gap-2 text-xs text-[#E65100]/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#E65100]/60 shrink-0" />
                                        Al menos una aeronave en estado <span className="font-semibold">Activo</span> —{" "}
                                        <button
                                            onClick={() => router.push("/owner/aeronaves")}
                                            className="underline font-medium hover:opacity-80"
                                        >
                                            Ir a aeronaves
                                        </button>
                                    </li>
                                )}
                                {!hasCaptain && (
                                    <li className="flex items-center gap-2 text-xs text-[#E65100]/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#E65100]/60 shrink-0" />
                                        Al menos un Capitán / Piloto en estado <span className="font-semibold">Activo</span> —{" "}
                                        <button
                                            onClick={() => router.push("/owner/tripulacion")}
                                            className="underline font-medium hover:opacity-80"
                                        >
                                            Ir a tripulación
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <h2 className="text-small font-semibold text-text">Vuelos próximos</h2>
                    <Button
                        onClick={() => canCreate && router.push("/owner/vuelos/nuevo")}
                        variant="primary"
                        className="h-10 px-4 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={!canCreate}
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo vuelo
                    </Button>
                </div>

                <FlightsTable
                    flights={paginated}
                    onView={(id) => router.push(`/owner/vuelos/${id}`)}
                    onEdit={(id) => router.push(`/owner/vuelos/${id}/edit`)}
                    onDelete={handleDeleteRequest}
                />

                <FlightsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filtered.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>

            <ConfirmDialog
                open={confirmDeleteId !== null}
                title="Eliminar vuelo"
                description="¿Estás seguro de que deseas eliminar este vuelo? Si tiene pasajeros con reservaciones activas, se les notificará por correo."
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                isLoading={isDeleting}
                destructive
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDeleteId(null)}
            />
        </div>
    );
}
