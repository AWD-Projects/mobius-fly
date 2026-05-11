"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Image } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { toast } from "@/components/atoms/Toast";
import { updateAircraftStatus, deleteAircraft } from "@/app/actions/aircraft";
import type { AircraftDetailData } from "@/app/actions/aircraft";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    data:    AircraftDetailData;
    ownerId: string;
}

// ─── Config maps ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; status: "success" | "pending" | "inactive" }> = {
    ACTIVE:      { label: "Activo",          status: "success"  },
    MAINTENANCE: { label: "Mantenimiento",   status: "pending"  },
    INACTIVE:    { label: "Inactivo",        status: "inactive" },
};

const DOC_STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
    APPROVED:       { label: "Validado",    bg: "#E8F5E9", text: "#2E7D32" },
    PENDING_REVIEW: { label: "En revisión", bg: "#FFF8E1", text: "#F57F17" },
    REJECTED:       { label: "Rechazado",   bg: "#FFEBEE", text: "#C62828" },
};

const DOC_TYPE_LABEL: Record<string, string> = {
    PROOF_OF_OWNERSHIP: "Proof of ownership",
    PERMITS:            "Permisos AFAC / DGAC",
    POWER_OF_ATTORNEY:  "Carta poder notariada",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AircraftDetailContent({ data, ownerId }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [currentStatus, setCurrentStatus] = useState(data.status.toUpperCase());
    const [confirmDelete, setConfirmDelete] = useState(false);

    const statusCfg  = STATUS_CONFIG[currentStatus] ?? { label: currentStatus, status: "inactive" as const };
    const isActive   = currentStatus === "ACTIVE";
    const isMaint    = currentStatus === "MAINTENANCE";
    const name       = data.manufacturer ? `${data.manufacturer} ${data.model}` : data.model;

    const handleDelete = () => {
        startTransition(async () => {
            const { error } = await deleteAircraft(data.id, ownerId);
            if (error) {
                toast.error("No se pudo eliminar", error);
                setConfirmDelete(false);
            } else {
                toast.success("Aeronave eliminada", `${name} fue eliminada correctamente.`);
                router.push("/owner/aeronaves");
            }
        });
    };

    const handleSetStatus = (next: string) => {
        startTransition(async () => {
            const { error } = await updateAircraftStatus(data.id, ownerId, next);
            if (error) {
                toast.error("Error al actualizar", error);
            } else {
                setCurrentStatus(next);
                const labels: Record<string, string> = {
                    MAINTENANCE: "Aeronave en mantenimiento",
                    ACTIVE:      "Aeronave marcada como activa",
                    INACTIVE:    "Aeronave marcada como inactiva",
                };
                toast.success("Estado actualizado", labels[next] ?? next);
            }
        });
    };

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="w-full bg-[#f6f6f4] px-12 py-8 border-b border-border">
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[28px] font-semibold text-text">{name}</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted">{data.tail_number}</span>
                            <StatusBadge status={statusCfg.status}>{statusCfg.label}</StatusBadge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-12 py-8 flex gap-8">
                {/* Left Column */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Data Card */}
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <h2 className="text-sm font-semibold text-text">Datos de la aeronave</h2>

                        <div className="flex flex-col gap-4">
                            {data.manufacturer && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted">Fabricante</span>
                                    <span className="text-[13px] font-medium text-text">{data.manufacturer}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted">Modelo</span>
                                <span className="text-[13px] font-medium text-text">{data.model}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted">Matrícula</span>
                                <span className="text-[13px] font-medium text-text">{data.tail_number}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted">Capacidad total</span>
                                <span className="text-[13px] font-medium text-text">{data.seats} pasajeros</span>
                            </div>

                            {data.year && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted">Año de fabricación</span>
                                    <span className="text-[13px] font-medium text-text">{data.year}</span>
                                </div>
                            )}

                            {data.range_km && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted">Rango</span>
                                    <span className="text-[13px] font-medium text-text">{data.range_km.toLocaleString()} km</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Photos Card */}
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3">
                        <h2 className="text-sm font-semibold text-text">Imágenes</h2>

                        {data.photos.length === 0 ? (
                            <div className="flex gap-3">
                                {[0, 1].map((i) => (
                                    <div key={i} className="flex-1 h-32 bg-neutral/10 rounded-xl flex items-center justify-center">
                                        <Image className="w-8 h-8 text-muted/40" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {data.photos.slice(0, 4).map((url, i) => (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        key={i}
                                        src={url}
                                        alt={`Foto ${i + 1}`}
                                        className="flex-1 h-32 object-cover rounded-xl min-w-[40%]"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-80 flex flex-col gap-6">
                    {/* Summary */}
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <h2 className="text-sm font-semibold text-text">Resumen rápido</h2>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted">Capacidad</span>
                                <span className="text-[13px] font-medium text-text">{data.seats} pasajeros</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted">Vuelos próximos</span>
                                <span className="text-[13px] font-medium text-text">{data.upcoming_flights} vuelos</span>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3.5">
                        <h2 className="text-[13px] font-semibold text-text">Documentación</h2>

                        {data.documents.length === 0 ? (
                            <p className="text-[11px] text-[#999999]">Sin documentos cargados.</p>
                        ) : (
                            data.documents.map((doc, index) => {
                                const statusCode = doc.document_status?.code ?? "PENDING_REVIEW";
                                const cfg = DOC_STATUS_CONFIG[statusCode] ?? DOC_STATUS_CONFIG.PENDING_REVIEW;
                                return (
                                    <div
                                        key={doc.id}
                                        className={`flex flex-col gap-2 py-3 ${index < data.documents.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}
                                    >
                                        <span className="text-[11px] font-medium text-text">
                                            {DOC_TYPE_LABEL[doc.document_type] ?? doc.document_type}
                                        </span>
                                        <span
                                            className="text-[10px] font-medium px-2 py-0.5 rounded inline-flex items-center gap-1.5 w-fit"
                                            style={{ backgroundColor: cfg.bg, color: cfg.text }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.text }} />
                                            {cfg.label}
                                        </span>
                                        {doc.rejected_reason && (
                                            <span className="text-[10px] text-[#C62828]">{doc.rejected_reason}</span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3">
                        <h2 className="text-sm font-semibold text-text">Acciones</h2>

                        {isActive && (
                            <Button
                                onClick={() => handleSetStatus("MAINTENANCE")}
                                variant="primary"
                                className="w-full h-10"
                                disabled={isPending}
                            >
                                {isPending ? "Actualizando..." : "Marcar como mantenimiento"}
                            </Button>
                        )}

                        {isMaint && (
                            <Button
                                onClick={() => handleSetStatus("ACTIVE")}
                                variant="primary"
                                className="w-full h-10"
                                disabled={isPending}
                            >
                                {isPending ? "Actualizando..." : "Marcar como activo"}
                            </Button>
                        )}

                        {!isActive && !isMaint && (
                            <Button
                                onClick={() => handleSetStatus("ACTIVE")}
                                variant="primary"
                                className="w-full h-10"
                                disabled={isPending}
                            >
                                {isPending ? "Actualizando..." : "Activar aeronave"}
                            </Button>
                        )}

                        <Button
                            onClick={() => router.push(`/owner/aeronaves/${data.id}/edit`)}
                            variant="outline"
                            className="w-full h-10"
                            disabled={isPending}
                        >
                            Editar aeronave
                        </Button>

                        {!confirmDelete ? (
                            <Button
                                onClick={() => setConfirmDelete(true)}
                                variant="outline"
                                className="w-full h-10 text-red-600 border-red-200 hover:bg-red-50"
                                disabled={isPending}
                            >
                                Eliminar aeronave
                            </Button>
                        ) : (
                            <div className="flex flex-col gap-2 pt-1">
                                <p className="text-[11px] text-center text-[#666666]">
                                    ¿Confirmar eliminación? Esta acción no se puede deshacer.
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setConfirmDelete(false)}
                                        variant="outline"
                                        className="flex-1 h-9 text-xs"
                                        disabled={isPending}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleDelete}
                                        variant="outline"
                                        className="flex-1 h-9 text-xs text-red-600 border-red-300 hover:bg-red-50"
                                        disabled={isPending}
                                    >
                                        {isPending ? "Eliminando..." : "Confirmar"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
