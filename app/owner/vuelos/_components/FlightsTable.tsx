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
import { Pencil, Eye } from "lucide-react";

export interface Flight {
  id: string;
  route: string;
  date: string;
  aircraft: string;
  type: "charter" | "personal";
  status: "scheduled" | "in-flight" | "confirmed";
  capacity: string;
}

export interface FlightsTableProps {
  flights: Flight[];
  onView?: (id: string) => void;
  onEdit: (id: string) => void;
}

const statusConfig = {
  scheduled: { label: "Programado", status: "pending" as const },
  "in-flight": { label: "En vuelo", status: "info" as const },
  confirmed: { label: "Confirmado", status: "success" as const },
};

const typeConfig = {
  charter: { label: "Sencillo", color: "#F5F5F5", textColor: "#666666" },
  personal: { label: "Redondo", color: "#E8F5E9", textColor: "#2E7D32" },
};

export const FlightsTable: React.FC<FlightsTableProps> = ({
  flights,
  onView,
  onEdit,
}) => {
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
        {flights.map((flight, index) => (
          <TableRow key={flight.id} isLast={index === flights.length - 1}>
            <TableCell style={{ flex: 1 }} variant="emphasis">
              {flight.route}
            </TableCell>
            <TableCell style={{ flex: 1 }}>{flight.date}</TableCell>
            <TableCell style={{ flex: 1 }}>{flight.aircraft}</TableCell>
            <TableCell style={{ flex: 1 }}>
              <span
                className="inline-block px-2 py-1 rounded text-caption font-medium"
                style={{
                  backgroundColor: typeConfig[flight.type].color,
                  color: typeConfig[flight.type].textColor,
                }}
              >
                {typeConfig[flight.type].label}
              </span>
            </TableCell>
            <TableCell style={{ flex: 1 }}>
              <StatusBadge status={statusConfig[flight.status].status}>
                {statusConfig[flight.status].label}
              </StatusBadge>
            </TableCell>
            <TableCell style={{ flex: 1 }} variant="emphasis">
              {flight.capacity}
            </TableCell>
            <TableCell style={{ flex: 1 }}>
              <div className="flex items-center gap-3">
                {onView && (
                  <button
                    onClick={() => onView(flight.id)}
                    className="p-0 hover:opacity-70 transition-opacity"
                    aria-label="Ver detalles"
                  >
                    <Eye className="w-[18px] h-[18px] text-info" strokeWidth={1.5} />
                  </button>
                )}
                <button
                  onClick={() => onEdit(flight.id)}
                  className="p-0 hover:opacity-70 transition-opacity"
                  aria-label="Editar"
                >
                  <Pencil className="w-[18px] h-[18px] text-muted" strokeWidth={1.5} />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
