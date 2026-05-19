"use client";

import React from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/molecules/Table";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { IconButton } from "@/components/atoms/IconButton";
import { Pencil, Eye, Trash2, CalendarX } from "lucide-react";

export interface Flight {
    id:       string;
    route:    string;
    date:     string;
    aircraft: string;
    type:     "charter" | "personal";
    status:   "scheduled" | "in-flight" | "confirmed" | "completed" | "cancelled" | "delayed" | "pending_review";
    capacity: string;
}

export interface FlightsTableProps {
    flights:  Flight[];
    onView?:  (id: string) => void;
    onEdit:   (id: string) => void;
    onDelete?:(id: string) => void;
}

function DeleteCell({ id, onDelete }: { id: string; onDelete: (id: string) => void }) {
    return (
        <IconButton
            onClick={() => onDelete(id)}
            icon={<Trash2 className="w-[18px] h-[18px] text-red-400" strokeWidth={1.5} />}
            variant="default"
            size="sm"
            aria-label="Eliminar"
        />
    );
}

const statusConfig: Record<Flight["status"], { label: string; status: "pending" | "scheduled" | "info" | "success" | "inactive" | "warning" | "error" }> = {
    scheduled:      { label: "Programado",   status: "scheduled" },
    delayed:        { label: "Retrasado",    status: "warning"   },
    "in-flight":    { label: "En vuelo",     status: "info"      },
    confirmed:      { label: "A tiempo",     status: "success"   },
    completed:      { label: "Completado",   status: "inactive"  },
    cancelled:      { label: "Cancelado",    status: "error"     },
    pending_review: { label: "En revisión",  status: "pending"   },
};

const typeConfig = {
    charter:  { label: "Sencillo", color: "#F5F5F5", textColor: "#666666" },
    personal: { label: "Redondo",  color: "#E8F5E9", textColor: "#2E7D32" },
};

export const FlightsTable: React.FC<FlightsTableProps> = ({ flights, onView, onEdit, onDelete }) => {
    return (
        <Table>
            <TableHeader>
                <TableHead style={{ flex: 1 }}>Destino</TableHead>
                <TableHead style={{ flex: 1 }}>Fecha</TableHead>
                <TableHead style={{ flex: 1 }}>Aeronave</TableHead>
                <TableHead style={{ flex: 1 }}>Tipo</TableHead>
                <TableHead style={{ flex: 1 }}>Estado</TableHead>
                <TableHead style={{ flex: 1 }}>Capacidad</TableHead>
                <TableHead style={{ flex: 1 }}>Acciones</TableHead>
            </TableHeader>
            <TableBody>
                {flights.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <CalendarX className="w-8 h-8 text-border" strokeWidth={1.5} />
                        <p className="text-small text-muted">No hay vuelos registrados</p>
                    </div>
                )}
                {flights.map((flight, index) => {
                    const sCfg = statusConfig[flight.status] ?? { label: flight.status, status: "pending" as const };
                    const tCfg = typeConfig[flight.type];
                    return (
                        <TableRow key={flight.id} isLast={index === flights.length - 1}>
                            <TableCell style={{ flex: 1 }} variant="emphasis">{flight.route}</TableCell>
                            <TableCell style={{ flex: 1 }}>{flight.date}</TableCell>
                            <TableCell style={{ flex: 1 }}>{flight.aircraft}</TableCell>
                            <TableCell style={{ flex: 1 }}>
                                <span
                                    className="inline-block px-2 py-1 rounded text-caption font-medium"
                                    style={{ backgroundColor: tCfg.color, color: tCfg.textColor }}
                                >
                                    {tCfg.label}
                                </span>
                            </TableCell>
                            <TableCell style={{ flex: 1 }}>
                                <StatusBadge status={sCfg.status}>{sCfg.label}</StatusBadge>
                            </TableCell>
                            <TableCell style={{ flex: 1 }} variant="emphasis">{flight.capacity}</TableCell>
                            <TableCell style={{ flex: 1 }}>
                                <div className="flex items-center gap-3">
                                    {onView && (
                                        <IconButton
                                            onClick={() => onView(flight.id)}
                                            icon={<Eye className="w-[18px] h-[18px] text-info" strokeWidth={1.5} />}
                                            variant="default"
                                            size="sm"
                                            aria-label="Ver detalles"
                                        />
                                    )}
                                    <IconButton
                                        onClick={() => onEdit(flight.id)}
                                        icon={<Pencil className="w-[18px] h-[18px] text-muted" strokeWidth={1.5} />}
                                        variant="default"
                                        size="sm"
                                        aria-label="Editar"
                                    />
                                    {onDelete && <DeleteCell id={flight.id} onDelete={onDelete} />}
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
