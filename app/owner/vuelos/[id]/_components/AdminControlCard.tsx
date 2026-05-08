"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Download } from "lucide-react";
import { toast } from "@/components/atoms/Toast";
import { updateFlightStatus } from "@/app/actions/flights";
import type { OwnerFlightPassenger } from "@/app/actions/flights";

export interface AdminControlCardProps {
    flightId:      string;
    ownerId:       string;
    statusCode:    string;
    totalSeats:    number;
    soldSeats:     number;
    availableSeats:number;
    pricePerSeat:  string;
    passengers:    OwnerFlightPassenger[];
    onStatusChange:(code: string) => void;
}

// Status transitions available to the owner
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

    const transitions = TRANSITIONS[statusCode] ?? [];

    const handleStatusChange = (next: string, label: string) => {
        startTransition(async () => {
            const { error } = await updateFlightStatus(flightId, ownerId, next);
            if (error) {
                toast.error("Error al actualizar", error);
            } else {
                onStatusChange(next);
                toast.success("Estado actualizado", label);
            }
        });
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
                            disabled={isPending}
                        >
                            {isPending ? "Actualizando..." : label}
                        </Button>
                    ))}
                    <Button
                        onClick={() => router.push(`/owner/vuelos/${flightId}/edit`)}
                        variant="outline"
                        className="w-full h-12"
                        disabled={isPending}
                    >
                        Editar vuelo
                    </Button>
                </div>
            </div>
        </div>
    );
};
