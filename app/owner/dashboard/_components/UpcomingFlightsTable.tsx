"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/molecules/Table";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { ArrowRight } from "lucide-react";
import type { DashboardUpcomingFlight } from "@/app/actions/dashboard";

export interface UpcomingFlightsTableProps {
    flights:   DashboardUpcomingFlight[];
    onViewAll?: () => void;
}

const STATUS_CFG: Record<string, { label: string; status: "pending" | "info" | "success" | "inactive" }> = {
    SCHEDULED: { label: "Programado", status: "pending"  },
    DELAYED:   { label: "Retrasado",  status: "pending"  },
    IN_FLIGHT: { label: "En vuelo",   status: "info"     },
    ON_TIME:   { label: "A tiempo",   status: "success"  },
    COMPLETED: { label: "Completado", status: "inactive" },
    CANCELLED: { label: "Cancelado",  status: "inactive" },
};

const TYPE_CFG: Record<string, { label: string; bg: string; color: string }> = {
    ONE_WAY:    { label: "Sencillo", bg: "#F5F5F5",  color: "#666666" },
    ROUND_TRIP: { label: "Redondo",  bg: "#E8F5E9",  color: "#2E7D32" },
};

export const UpcomingFlightsTable: React.FC<UpcomingFlightsTableProps> = ({
    flights,
    onViewAll,
}) => {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h2 className="text-h3 font-semibold text-text">Vuelos próximos</h2>
                {onViewAll && (
                    <button
                        onClick={onViewAll}
                        className="flex items-center gap-1 text-small font-medium text-muted hover:text-text transition-colors"
                    >
                        Ver todos
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                )}
            </div>

            {flights.length === 0 ? (
                <p className="text-sm text-muted py-4">Sin vuelos próximos programados.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableHead width={220}>Destino</TableHead>
                        <TableHead width={150}>Fecha</TableHead>
                        <TableHead width={150}>Aeronave</TableHead>
                        <TableHead width={100}>Tipo</TableHead>
                        <TableHead width={130}>Estado</TableHead>
                        <TableHead style={{ flex: 1 }}>Capacidad</TableHead>
                    </TableHeader>
                    <TableBody>
                        {flights.map((flight, index) => {
                            const statusCfg = STATUS_CFG[flight.statusCode] ?? { label: flight.statusCode, status: "pending" as const };
                            const typeCfg   = TYPE_CFG[flight.flightType]   ?? TYPE_CFG.ONE_WAY;
                            return (
                                <TableRow
                                    key={flight.id}
                                    isLast={index === flights.length - 1}
                                    onClick={() => router.push(`/owner/vuelos/${flight.id}`)}
                                    className="cursor-pointer hover:bg-[#fafafa] transition-colors"
                                >
                                    <TableCell width={220} variant="emphasis">{flight.route}</TableCell>
                                    <TableCell width={150}>{flight.date}</TableCell>
                                    <TableCell width={150}>{flight.aircraft}</TableCell>
                                    <TableCell width={100}>
                                        <span
                                            className="inline-block px-2 py-1 rounded text-caption font-medium"
                                            style={{ backgroundColor: typeCfg.bg, color: typeCfg.color }}
                                        >
                                            {typeCfg.label}
                                        </span>
                                    </TableCell>
                                    <TableCell width={130}>
                                        <StatusBadge status={statusCfg.status}>
                                            {statusCfg.label}
                                        </StatusBadge>
                                    </TableCell>
                                    <TableCell style={{ flex: 1 }} variant="emphasis">
                                        {flight.capacity}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};
