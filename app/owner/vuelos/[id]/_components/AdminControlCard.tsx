"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Switch } from "@/components/atoms/Switch";
import { AlertTriangle, Download, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/components/atoms/Toast";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { updateFlightStatus, deleteFlight, cancelFlight, toggleFlightVisibility } from "@/app/actions/flights";
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
    isVisible:      boolean;
    onStatusChange: (code: string) => void;
}

const TRANSITIONS: Record<string, { label: string; next: string; destructive?: boolean }[]> = {
    PENDING_REVIEW: [],
    SCHEDULED: [
        { label: "Marcar como A tiempo",   next: "ON_TIME" },
        { label: "Marcar como Retrasado",  next: "DELAYED" },
    ],
    ON_TIME: [
        { label: "Marcar como Retrasado",  next: "DELAYED" },
        { label: "Marcar como En vuelo",   next: "IN_FLIGHT" },
    ],
    DELAYED: [
        { label: "Marcar como A tiempo",   next: "ON_TIME" },
        { label: "Marcar como En vuelo",   next: "IN_FLIGHT" },
    ],
    IN_FLIGHT: [
        { label: "Marcar como Completado", next: "COMPLETED" },
    ],
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
    isVisible,
    onStatusChange,
}) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [pendingStatusNext, setPendingStatusNext] = useState<string | null>(null);
    const [visible, setVisible] = useState(isVisible);
    const [isTogglingVisibility, startVisibilityTransition] = useTransition();

    const transitions = TRANSITIONS[statusCode] ?? [];
    const hasPassengers = passengers.length > 0;
    const isTerminal = statusCode === "CANCELLED" || statusCode === "COMPLETED" || statusCode === "REJECTED";
    const canDelete = !hasPassengers && !isTerminal;
    const canCancel = !isTerminal && statusCode !== "PENDING_REVIEW" && statusCode !== "IN_FLIGHT";

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

    const handleToggleVisibility = (next: boolean) => {
        setVisible(next);
        startVisibilityTransition(async () => {
            const { error } = await toggleFlightVisibility(flightId, ownerId, next);
            if (error) {
                setVisible(!next);
                toast.error("Error", "No se pudo actualizar la visibilidad.");
            } else {
                toast.success(
                    next ? "Vuelo visible" : "Vuelo oculto",
                    next ? "El vuelo ya está visible para compradores." : "El vuelo está oculto para compradores.",
                );
            }
        });
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const { error } = await deleteFlight(flightId, ownerId);
        setIsDeleting(false);
        setShowDeleteDialog(false);
        if (error) {
            toast.error("No se pudo eliminar", error);
        } else {
            toast.success("Vuelo eliminado", "El vuelo fue eliminado correctamente.");
            router.push("/owner/vuelos");
        }
    };

    const handleCancel = async () => {
        setIsCancelling(true);
        const { error, notifiedPassengers } = await cancelFlight(flightId, ownerId);
        setIsCancelling(false);
        setShowCancelDialog(false);
        if (error) {
            toast.error("No se pudo cancelar", error);
        } else {
            onStatusChange("CANCELLED");
            if (notifiedPassengers > 0) {
                toast.success(
                    "Vuelo cancelado",
                    `Se notificó a ${notifiedPassengers} ${notifiedPassengers === 1 ? "pasajero" : "pasajeros"} por correo.`,
                );
            } else {
                toast.success("Vuelo cancelado", "El vuelo fue cancelado correctamente.");
            }
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
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-medium text-text">{p.full_name}</span>
                                        {p.is_minor && (
                                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                                Menor de edad
                                            </span>
                                        )}
                                    </div>
                                    {p.document_type && (
                                        <span className="text-[11px] text-muted">{p.document_type}</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {passengers.some((p) => p.is_minor) && (
                    <div className="flex items-start gap-2 mt-3 mb-1 bg-amber-50 border border-amber-200 rounded-md px-3 py-2.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                            <span className="font-semibold">Importante:</span> Este vuelo incluye menores de edad. Es indispensable contactar al responsable de la compra y a los tutores para obtener las cartas de autorización de viaje correspondientes antes del despegue.
                        </p>
                    </div>
                )}

                <Button
                    onClick={() => {}}
                    variant="ghost"
                    className="flex items-center justify-center gap-1.5 w-full"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar manifiesto PDF</span>
                </Button>
            </div>

            {/* Actions */}
            {!isTerminal && (
                <div className="px-6 py-6">
                    <h3 className="text-[13px] font-semibold text-text mb-3">Acciones</h3>
                    <div className="flex flex-col gap-2">
                        {transitions.map(({ label, next, destructive }) => (
                            <Button
                                key={next}
                                onClick={() => handleStatusChange(next, label)}
                                variant={destructive ? "ghost-destructive" : "outline"}
                                className="w-full h-10 justify-start"
                                isLoading={isPending && pendingStatusNext === next}
                                disabled={isPending || isDeleting}
                            >
                                {label}
                            </Button>
                        ))}
                        {statusCode !== "IN_FLIGHT" && (
                            <Button
                                onClick={() => router.push(`/owner/vuelos/${flightId}/edit`)}
                                variant="ghost"
                                className="w-full h-10 justify-start gap-2.5"
                                disabled={isPending || isDeleting}
                                icon={<Pencil className="w-4 h-4 text-muted" />}
                            >
                                Editar vuelo
                            </Button>
                        )}

                        <div className="-mx-6 h-px bg-border mt-4" />

                        <div className="flex items-center justify-between pt-3 pb-1">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[13px] font-medium text-text">Visible para compradores</span>
                                <span className="text-[11px] text-muted">
                                    {visible ? "El vuelo aparece en la plataforma" : "El vuelo está oculto"}
                                </span>
                            </div>
                            <Switch
                                checked={visible}
                                disabled={isTogglingVisibility}
                                onChange={(e) => handleToggleVisibility(e.target.checked)}
                            />
                        </div>

                        {canCancel && (
                            <Button
                                onClick={() => setShowCancelDialog(true)}
                                variant="ghost-destructive"
                                className="w-full h-10 justify-start gap-2.5 text-[12px]"
                                disabled={isPending || isDeleting || isCancelling}
                                icon={<Trash2 className="w-4 h-4" />}
                            >
                                Cancelar vuelo
                            </Button>
                        )}

                        {canDelete && (
                            <Button
                                onClick={() => setShowDeleteDialog(true)}
                                variant="ghost-destructive"
                                className="w-full h-10 justify-start gap-2.5 text-[12px]"
                                disabled={isPending || isDeleting || isCancelling}
                                icon={<Trash2 className="w-4 h-4" />}
                            >
                                Eliminar vuelo
                            </Button>
                        )}
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={showCancelDialog}
                title="Cancelar vuelo"
                description={
                    hasPassengers
                        ? "Este vuelo tiene pasajeros con reservaciones confirmadas. Al cancelar, se les notificará por correo electrónico."
                        : "¿Estás seguro de que deseas cancelar este vuelo? Esta acción no se puede deshacer."
                }
                warning={
                    hasPassengers
                        ? `Se enviará un correo de cancelación a ${passengers.length} ${passengers.length === 1 ? "pasajero" : "pasajeros"}. El equipo de Mobius Fly se pondrá en contacto con ellos para procesar su reembolso o compensación.`
                        : undefined
                }
                confirmLabel="Cancelar vuelo"
                cancelLabel="Volver"
                isLoading={isCancelling}
                destructive
                onConfirm={handleCancel}
                onCancel={() => setShowCancelDialog(false)}
            />

            <ConfirmDialog
                open={showDeleteDialog}
                title="Eliminar vuelo"
                description="¿Estás seguro de que deseas eliminar este vuelo? Esta acción no se puede deshacer."
                confirmLabel="Eliminar"
                cancelLabel="Volver"
                isLoading={isDeleting}
                destructive
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </div>
    );
};
