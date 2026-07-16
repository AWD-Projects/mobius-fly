"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { ArrowLeft, CheckCircle, AlertCircle, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { toast } from "@/components/atoms/Toast";
import { updateCrewMemberStatus, deleteCrewMember } from "@/app/actions/crew";
import type { CrewDetailData } from "@/app/actions/crew";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    data:    CrewDetailData;
    ownerId: string;
}

// ─── Config maps ──────────────────────────────────────────────────────────────

const ROLE_LABEL: Record<string, string> = {
    CAPTAIN:          "Capitán",
    FIRST_OFFICER:    "Copiloto",
    FLIGHT_ATTENDANT: "TCP",
};

const FLIGHT_STATUS_CONFIG: Record<string, { label: string; status: "success" | "pending" | "info" | "inactive" }> = {
    APPROVED:       { label: "Aprobado",    status: "success"  },
    ON_TIME:        { label: "A tiempo",    status: "success"  },
    DELAYED:        { label: "Retrasado",   status: "pending"  },
    IN_FLIGHT:      { label: "En vuelo",    status: "info"     },
    PENDING_REVIEW: { label: "En revisión", status: "pending"  },
    COMPLETED:      { label: "Completado",  status: "inactive" },
    CANCELLED:      { label: "Cancelado",   status: "inactive" },
};


function formatDate(iso: string): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("es-MX", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
}

function getInitials(first: string, last: string): string {
    return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CrewDetailContent({ data, ownerId }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [currentStatus, setCurrentStatus] = useState(data.status);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const roleCode   = data.crew_role?.code ?? "";
    const roleLabel  = data.crew_role?.name ?? ROLE_LABEL[roleCode] ?? roleCode;
    const isPendingApproval = currentStatus.toUpperCase() === "ACTIVE" && !data.is_approved;
    const isActive   = currentStatus.toUpperCase() === "ACTIVE" && data.is_approved;
    const isRejected = currentStatus.toUpperCase() === "REJECTED";

    const activeFlights = data.assigned_flights.filter(
        (f) => !["COMPLETED", "CANCELLED"].includes(f.status_code),
    ).length;

    const lastFlight = data.assigned_flights
        .filter((f) => f.departure_datetime)
        .sort((a, b) => new Date(b.departure_datetime).getTime() - new Date(a.departure_datetime).getTime())[0];

    const handleDelete = () => {
        startTransition(async () => {
            const { error } = await deleteCrewMember(data.id, ownerId);
            if (error) {
                toast.error("No se pudo eliminar", error);
            } else {
                toast.success("Tripulante eliminado", `${data.first_name} ${data.last_name} fue eliminado.`);
                router.push("/owner/tripulacion");
            }
        });
    };

    const handleToggleStatus = () => {
        const next = isActive ? "INACTIVE" : "ACTIVE";
        startTransition(async () => {
            const { error } = await updateCrewMemberStatus(data.id, ownerId, next);
            if (error) {
                toast.error("Error al actualizar", error);
            } else {
                setCurrentStatus(next);
                toast.success(
                    "Estado actualizado",
                    next === "INACTIVE" ? "Tripulante marcado como no disponible" : "Tripulante marcado como activo",
                );
            }
        });
    };

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <Button
                    onClick={() => router.push("/owner/tripulacion")}
                    variant="link"
                    className="flex items-center gap-3 mb-5 p-0 text-sm font-medium text-text hover:opacity-70"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver a tripulación
                </Button>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-[72px] h-[72px] rounded-full bg-[#E3F2FD] flex items-center justify-center flex-shrink-0">
                                <span className="text-lg font-semibold text-info">
                                    {getInitials(data.first_name, data.last_name)}
                                </span>
                            </div>
                            <h1 className="text-[26px] font-semibold text-text">
                                {data.first_name} {data.last_name}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-[#666666]">{roleLabel}</span>
                            <StatusBadge status={isActive ? "success" : isRejected ? "inactive" : isPendingApproval ? "pending" : "inactive"}>
                                {isActive ? "Activo" : isRejected ? "Rechazado" : isPendingApproval ? "Pendiente de aprobación" : "Inactivo"}
                            </StatusBadge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-12 pb-10 flex gap-8">
                {/* Left Column */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Info Card */}
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <h2 className="text-[13px] font-semibold text-text">Información del tripulante</h2>

                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-[#666666]">Nombre completo</span>
                            <span className="text-xs font-medium text-text">
                                {data.first_name} {data.last_name}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-[#666666]">Rol</span>
                            <span className="text-xs font-medium text-text">{roleLabel}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-[#666666]">No. Licencia</span>
                            <span className="text-xs font-medium text-text">{data.license_number ?? "—"}</span>
                        </div>

                        {data.email && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-[#666666]">Correo</span>
                                <span className="text-xs font-medium text-text">{data.email}</span>
                            </div>
                        )}

                        {data.phone && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-[#666666]">Teléfono</span>
                                <span className="text-xs font-medium text-text">{data.phone}</span>
                            </div>
                        )}
                    </div>

                    {/* Motivo de rechazo */}
                    {isRejected && data.rejected_reason && (
                        <div className="bg-white rounded-2xl border border-[#EF9A9A]/40 p-6 flex flex-col gap-2">
                            <h2 className="text-[13px] font-semibold text-[#C62828]">Motivo de rechazo</h2>
                            <p className="text-[13px] text-[#C62828]/80 leading-relaxed">{data.rejected_reason}</p>
                        </div>
                    )}

                    {/* Assigned Flights */}
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <h2 className="text-sm font-semibold text-text">Vuelos asignados</h2>

                        {data.assigned_flights.length === 0 ? (
                            <p className="text-xs text-[#999999]">Sin vuelos asignados.</p>
                        ) : (
                            <>
                                <div className="bg-[#FAFAFA] px-6 py-3.5 border-b border-border flex items-center">
                                    <div className="flex-1"><span className="text-xs font-medium text-[#666666]">Ruta</span></div>
                                    <div className="flex-1"><span className="text-xs font-medium text-[#666666]">Fecha</span></div>
                                    <div className="flex-1"><span className="text-xs font-medium text-[#666666]">Aeronave</span></div>
                                    <div className="flex-1"><span className="text-xs font-medium text-[#666666]">Estado</span></div>
                                </div>

                                {data.assigned_flights.map((flight, index) => {
                                    const cfg = FLIGHT_STATUS_CONFIG[flight.status_code] ?? { label: flight.status_code, status: "inactive" as const };
                                    return (
                                        <div
                                            key={flight.flight_id}
                                            className={`flex items-center px-6 py-[18px] ${index < data.assigned_flights.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}
                                        >
                                            <div className="flex-1">
                                                <span className="text-[13px] font-medium text-text">
                                                    {flight.departure_iata} → {flight.arrival_iata}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-[13px] text-[#666666]">
                                                    {formatDate(flight.departure_datetime)}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-[13px] text-[#666666]">{flight.tail_number}</span>
                                            </div>
                                            <div className="flex-1">
                                                <StatusBadge status={cfg.status}>{cfg.label}</StatusBadge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-80 flex flex-col gap-6">
                    {/* Summary */}
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3.5">
                        <h2 className="text-[13px] font-semibold text-text">Resumen</h2>

                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-[#999999]">Rol</span>
                            <span className="text-[11px] font-semibold text-text text-right">{roleLabel}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-[#999999]">Vuelos activos</span>
                            <span className="text-[11px] font-semibold text-text text-right">{activeFlights}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-[#999999]">Última asignación</span>
                            <span className="text-[11px] font-semibold text-text text-right">
                                {lastFlight ? formatDate(lastFlight.departure_datetime) : "—"}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-2">
                        <h2 className="text-[13px] font-semibold text-text mb-1">Acciones</h2>

                        {!isRejected && !isPendingApproval && (
                            <Button
                                onClick={handleToggleStatus}
                                variant="outline"
                                className="w-full h-10 justify-start gap-2.5"
                                isLoading={isPending}
                                icon={isActive
                                    ? <AlertCircle className="w-4 h-4 text-muted" />
                                    : <CheckCircle className="w-4 h-4 text-muted" />
                                }
                            >
                                {isActive ? "Marcar como no disponible" : "Marcar como activo"}
                            </Button>
                        )}

                        {isPendingApproval && (
                            <Button
                                onClick={() => router.push(`/owner/tripulacion/${data.id}/edit`)}
                                variant="ghost"
                                className="w-full h-10 justify-start gap-2.5"
                                disabled={isPending}
                                icon={<Pencil className="w-4 h-4 text-muted" />}
                            >
                                Editar tripulante
                            </Button>
                        )}

                        <div className="w-full h-px bg-border mt-1" />

                        <Button
                            onClick={() => setShowDeleteDialog(true)}
                            variant="ghost-destructive"
                            className="w-full h-10 justify-start gap-2.5 text-[12px]"
                            disabled={isPending}
                            icon={<Trash2 className="w-4 h-4" />}
                        >
                            Eliminar tripulante
                        </Button>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={showDeleteDialog}
                title="Eliminar tripulante"
                description="¿Estás seguro de que deseas eliminar este tripulante? Esta acción no se puede deshacer."
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                isLoading={isPending}
                destructive
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </div>
    );
}
