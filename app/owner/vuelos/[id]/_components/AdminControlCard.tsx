"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Download } from "lucide-react";
import { toast } from "@/components/atoms/Toast";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { updateFlightStatus, deleteFlight } from "@/app/actions/flights";
import type { OwnerFlightPassenger } from "@/app/actions/flights";

export interface AdminControlCardProps {
    flightId:       string;
    ownerId:        string;
    statusCode:     string;
    totalSeats:     number;
    soldSeats:      number;
    availableSeats: number;
    pricePerSeat:   string;
    passengers:     OwnerFlightPassenger[];
    onStatusChange: (code: string) => void;
}

const TRANSITIONS: Record<string, { label: string; next: string }[]> = {
    SCHEDULED: [{ label: "Marcar como En vuelo", next: "IN_FLIGHT" }, { label: "Cancelar vuelo", next: "CANCELLED" }],
    DELAYED:   [{ label: "Marcar como En vuelo", next: "IN_FLIGHT" }, { label: "Cancelar vuelo", next: "CANCELLED" }],
    ON_TIME:   [{ label: "Marcar como En vuelo", next: "IN_FLIGHT" }],
    IN_FLIGHT: [{ label: "Marcar como Completado", next: "COMPLETED" }],
};

export const AdminControlCard: React.FC<AdminControlCardProps> = ({
    flightId,
    ownerId,
    statusCode,
    totalSeats,
    soldSeats,
    availableSeats,
    pricePerSeat,
    passengers,
    onStatusChange,
}) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [pendingStatusNext, setPendingStatusNext] = useState<string | null>(null);

    const transitions = TRANSITIONS[statusCode] ?? [];
    const hasPassengers = passengers.length > 0;

    const handleStatusChange = (next: string, label: string) => {
        setPendingStatusNext(next);
        startTransition(async () => {
            const { error } = await updateFlightStatus(flightId, ownerId, next);
            setPendingStatusNext(null);
            if (error) {
                toast.error("Error al actualizar", error);
            } else {
                onStatusChange(next);
                toast.success("Estado actualizado", label);
            }
        });
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const { error, notifiedPassengers } = await deleteFlight(flightId, ownerId);
        setIsDeleting(false);
        setShowDeleteDialog(false);
        if (error) {
            toast.error("No se pudo eliminar", error);
        } else {
            if (notifiedPassengers > 0) {
                toast.success(
                    "Vuelo cancelado",
                    `Se notificó a ${notifiedPassengers} ${notifiedPassengers === 1 ? "pasajero" : "pasajeros"} por correo.`,
                );
            } else {
                toast.success("Vuelo eliminado", "El vuelo fue eliminado correctamente.");
            }
            router.push("/owner/vuelos");
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            {/* Occupancy */}
            <div className="px-6 py-6 border-b border-border">
                <h3 className="text-[13px] font-semibold text-text mb-4">Resumen de ocupación</h3>

                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 bg-[#FAFAFA] rounded-md p-4 flex flex-col gap-1">
                        <span className="text-[28px] font-medium text-text">{totalSeats}</span>
                        <span className="text-[11px] font-medium text-muted">Asientos totales</span>
                    </div>
                    <div className="flex-1 bg-[#FAFAFA] rounded-md p-4 flex flex-col gap-1">
                        <span className="text-[28px] font-medium text-[#2E7D32]">{soldSeats}</span>
                        <span className="text-[11px] font-medium text-muted">Vendidos</span>
                    </div>
                    <div className="flex-1 bg-[#FAFAFA] rounded-md p-4 flex flex-col gap-1">
                        <span className="text-[28px] font-medium text-text">{availableSeats}</span>
                        <span className="text-[11px] font-medium text-muted">Disponibles</span>
                    </div>
                </div>

                <div className="bg-[#FAFAFA] rounded-md px-4 py-3 flex items-center justify-between">
                    <span className="text-[13px] text-[#666666]">Precio por asiento</span>
                    <span className="text-[15px] font-semibold text-text">{pricePerSeat}</span>
                </div>
            </div>

            {/* Passengers */}
            <div className="px-6 py-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[13px] font-semibold text-text">Pasajeros</h3>
                    <div className="bg-[#F5F5F5] rounded px-2 py-1">
                        <span className="text-[11px] font-medium text-[#666666]">
                            {soldSeats} de {totalSeats}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col">
                    {passengers.length === 0 ? (
                        <p className="text-[11px] text-muted py-2">Sin pasajeros confirmados aún.</p>
                    ) : (
                        passengers.map((p, i) => (
                            <div
                                key={p.id}
                                className={`flex items-center justify-between py-3 ${i < passengers.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[13px] font-medium text-text">{p.full_name}</span>
                                    {p.document_type && (
                                        <span className="text-[11px] text-muted">{p.document_type}</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Button
                    onClick={() => {}}
                    variant="ghost"
                    className="flex items-center justify-center gap-1.5 w-full pt-3 h-auto"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar manifiesto PDF</span>
                </Button>
            </div>

            {/* Actions */}
            <div className="px-6 py-6">
                <h3 className="text-[13px] font-semibold text-text mb-4">Acciones</h3>
                <div className="flex flex-col gap-3">
                    {transitions.map(({ label, next }) => (
                        <Button
                            key={next}
                            onClick={() => handleStatusChange(next, label)}
                            variant={next === "CANCELLED" ? "outline" : "primary"}
                            className="w-full h-12"
                            isLoading={isPending && pendingStatusNext === next}
                            disabled={isPending || isDeleting}
                        >
                            {label}
                        </Button>
                    ))}
                    <Button
                        onClick={() => router.push(`/owner/vuelos/${flightId}/edit`)}
                        variant="outline"
                        className="w-full h-12"
                        disabled={isPending || isDeleting}
                    >
                        Editar vuelo
                    </Button>
                    <Button
                        onClick={() => setShowDeleteDialog(true)}
                        variant="outline"
                        className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50"
                        disabled={isPending || isDeleting}
                    >
                        Eliminar vuelo
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                open={showDeleteDialog}
                title="Eliminar vuelo"
                description={
                    hasPassengers
                        ? "Este vuelo tiene pasajeros con reservaciones activas. Al eliminar el vuelo, se les notificará por correo electrónico."
                        : "¿Estás seguro de que deseas eliminar este vuelo? Esta acción no se puede deshacer."
                }
                warning={
                    hasPassengers
                        ? `Se enviará un correo de cancelación a ${passengers.length} ${passengers.length === 1 ? "pasajero" : "pasajeros"}. El equipo de Mobius Fly se pondrá en contacto con ellos para procesar su reembolso o compensación.`
                        : undefined
                }
                confirmLabel="Eliminar vuelo"
                cancelLabel="Cancelar"
                isLoading={isDeleting}
                destructive
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </div>
    );
};
