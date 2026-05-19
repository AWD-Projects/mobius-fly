"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { AircraftFilterBar, AircraftFilters } from "./AircraftFilterBar";
import { AircraftTable, Aircraft } from "./AircraftTable";
import { AircraftPagination } from "./AircraftPagination";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { toast } from "@/components/atoms/Toast";
import { deleteAircraft } from "@/app/actions/aircraft";
import type { AircraftListItem } from "@/app/actions/aircraft";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    aircraft: AircraftListItem[];
    ownerId:  string;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function toDisplayAircraft(item: AircraftListItem): Aircraft {
    let status: Aircraft["status"];
    if (item.status === "ACTIVE") {
        if      (item.doc_status === "missing")  status = "doc_missing";
        else if (item.doc_status === "pending")  status = "doc_pending";
        else if (item.doc_status === "rejected") status = "doc_rejected";
        else                                     status = "active";
    } else {
        status = item.status.toLowerCase() as Aircraft["status"];
    }
    return {
        id:           item.id,
        name:         item.manufacturer ? `${item.manufacturer} ${item.model}` : item.model,
        base:         "—",
        capacity:     `${item.seats} pasajeros`,
        type:         item.aircraft_type ?? "jet",
        status,
        registration: item.tail_number,
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AircraftListContent({ aircraft: initialAircraft, ownerId }: Props) {
    const router = useRouter();
    const [aircraftList, setAircraftList] = useState<AircraftListItem[]>(initialAircraft);
    const [filters, setFilters] = useState<AircraftFilters>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const itemsPerPage = 5;

    const handleDeleteRequest = (id: string) => setConfirmDeleteId(id);

    const handleDeleteConfirm = async () => {
        if (!confirmDeleteId) return;
        setIsDeleting(true);
        const { error } = await deleteAircraft(confirmDeleteId, ownerId);
        setIsDeleting(false);
        setConfirmDeleteId(null);
        if (error) {
            toast.error("No se pudo eliminar", error);
        } else {
            setAircraftList((prev) => prev.filter((a) => a.id !== confirmDeleteId));
            toast.success("Aeronave eliminada", "La aeronave fue eliminada correctamente.");
        }
    };

    const display = aircraftList.map(toDisplayAircraft);

    const filtered = display.filter((a) => {
        if (filters.type && a.type !== filters.type) return false;
        if (filters.capacity) {
            const num = parseInt(a.capacity);
            if (filters.capacity === "small"  && num > 8)  return false;
            if (filters.capacity === "medium" && (num < 9 || num > 16)) return false;
            if (filters.capacity === "large"  && num < 17) return false;
        }
        if (filters.status && a.status !== filters.status) return false;
        return true;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start      = (currentPage - 1) * itemsPerPage;
    const paginated  = filtered.slice(start, start + itemsPerPage);

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <h1 className="text-[26px] font-semibold text-text">Aeronaves</h1>
                <p className="text-small text-muted mt-2">Gestión de tu flota</p>
            </div>

            <AircraftFilterBar
                filters={filters}
                onFiltersChange={(f) => { setFilters(f); setCurrentPage(1); }}
                onClearFilters={() => { setFilters({}); setCurrentPage(1); }}
            />

            <div className="px-12 py-0 flex flex-col gap-[18px]">
                <div className="flex items-center justify-between">
                    <h2 className="text-small font-semibold text-text">Flota activa</h2>
                    <Button
                        onClick={() => router.push("/owner/aeronaves/nuevo")}
                        variant="primary"
                        className="h-10 px-4 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva aeronave
                    </Button>
                </div>

                <AircraftTable
                    aircraft={paginated}
                    onView={(id) => router.push(`/owner/aeronaves/${id}`)}
                    onEdit={(id) => router.push(`/owner/aeronaves/${id}/edit`)}
                    onDelete={handleDeleteRequest}
                />

                <AircraftPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filtered.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>

            <ConfirmDialog
                open={confirmDeleteId !== null}
                title="Eliminar aeronave"
                description="¿Estás seguro de que deseas eliminar esta aeronave? Esta acción no se puede deshacer."
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
