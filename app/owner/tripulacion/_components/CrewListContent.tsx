"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Plus } from "lucide-react";
import { CrewFilterBar, type CrewFilters } from "./CrewFilterBar";
import { CrewCard, type CrewMember } from "./CrewCard";
import { CrewPagination } from "./CrewPagination";
import { AddCrewModal } from "./AddCrewModal";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { toast } from "@/components/atoms/Toast";
import { deleteCrewMember } from "@/app/actions/crew";
import type { CrewListItem, CrewRoleRow } from "@/app/actions/crew";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    crew:      CrewListItem[];
    ownerId:   string;
    crewRoles: CrewRoleRow[];
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

const ROLE_DISPLAY: Record<string, string> = {
    CAPTAIN:           "Capitán / Piloto",
    FIRST_OFFICER:     "Copiloto / Piloto",
    FLIGHT_ATTENDANT:  "TCP / Sobrecargo",
};

const ROLE_FILTER_CODE: Record<string, string> = {
    pilot:        "CAPTAIN",
    copilot:      "FIRST_OFFICER",
    "cabin-crew": "FLIGHT_ATTENDANT",
};

function toCrewMember(item: CrewListItem): CrewMember {
    let status: CrewMember["status"];
    if (item.status === "ACTIVE") {
        status = item.is_approved ? "active" : "pending";
    } else {
        status = "inactive";
    }
    return {
        id:       item.id,
        name:     `${item.first_name} ${item.last_name}`.trim(),
        role:     ROLE_DISPLAY[item.crew_role?.code ?? ""] ?? (item.crew_role?.code ?? "—"),
        base:     "—",
        licenses: item.license_number ? [item.license_number] : [],
        status,
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CrewListContent({ crew: initialCrew, ownerId, crewRoles }: Props) {
    const router = useRouter();
    const [crewList, setCrewList] = useState<CrewListItem[]>(initialCrew);
    const [filters, setFilters] = useState<CrewFilters>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const itemsPerPage = 4;

    const handleDeleteConfirm = async () => {
        if (!confirmDeleteId) return;
        setIsDeleting(true);
        const { error } = await deleteCrewMember(confirmDeleteId, ownerId);
        setIsDeleting(false);
        setConfirmDeleteId(null);
        if (error) {
            toast.error("No se pudo eliminar", error);
        } else {
            setCrewList((prev) => prev.filter((c) => c.id !== confirmDeleteId));
            toast.success("Tripulante eliminado", "El tripulante fue eliminado correctamente.");
        }
    };

    const allMembers = crewList.map(toCrewMember);

    const filteredMembers = allMembers.filter((member) => {
        if (filters.role) {
            const targetCode = ROLE_FILTER_CODE[filters.role];
            const memberCode = crewList.find((c) => c.id === member.id)?.crew_role?.code ?? "";
            if (targetCode && memberCode !== targetCode) return false;
        }
        if (filters.status && member.status !== filters.status) return false;
        return true;
    });

    const totalPages  = Math.ceil(filteredMembers.length / itemsPerPage);
    const startIndex  = (currentPage - 1) * itemsPerPage;
    const paginated   = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

    const handleFiltersChange = (next: CrewFilters) => {
        setFilters(next);
        setCurrentPage(1);
    };

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <h1 className="text-[26px] font-semibold text-text">Tripulación</h1>
                <p className="text-small text-muted mt-2">Gestión de tu tripulación</p>
            </div>

            {/* Filter Bar */}
            <CrewFilterBar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={() => { setFilters({}); setCurrentPage(1); }}
            />

            {/* Content */}
            <div className="px-12 py-0 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-small font-semibold text-text">Tripulación disponibles</h2>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        variant="primary"
                        className="h-10 px-4 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo tripulante
                    </Button>
                </div>

                {paginated.length === 0 ? (
                    <p className="text-sm text-[#999999] py-8 text-center">
                        No se encontraron miembros de tripulación.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {paginated.map((member) => (
                            <CrewCard
                                key={member.id}
                                member={member}
                                onView={(id) => router.push(`/owner/tripulacion/${id}`)}
                                onEdit={(id) => router.push(`/owner/tripulacion/${id}/edit`)}
                                onDelete={(id) => setConfirmDeleteId(id)}
                            />
                        ))}
                    </div>
                )}

                <CrewPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredMembers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>

            <AddCrewModal
                open={showAddModal}
                ownerId={ownerId}
                crewRoles={crewRoles}
                onClose={() => setShowAddModal(false)}
                onSuccess={(member) => setCrewList((prev) => [member, ...prev])}
            />

            <ConfirmDialog
                open={confirmDeleteId !== null}
                title="Eliminar tripulante"
                description="¿Estás seguro de que deseas eliminar este tripulante? Esta acción no se puede deshacer."
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
