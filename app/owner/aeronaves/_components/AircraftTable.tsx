"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/molecules/Table";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { Pencil, Eye } from "lucide-react";

export interface Aircraft {
  id: string;
  name: string;
  base: string;
  capacity: string;
  type: string;
  status: "active" | "maintenance" | "inactive";
  registration: string;
}

export interface AircraftTableProps {
  aircraft: Aircraft[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

const statusConfig = {
  active: { label: "Activo", status: "success" as const },
  maintenance: { label: "Mantenimiento", status: "pending" as const },
  inactive: { label: "Inactivo", status: "inactive" as const },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  jet: { label: "Jet Ejecutivo", color: "#E3F2FD" },
  turboprop: { label: "Turbohélice", color: "#FFF3E0" },
  light: { label: "Jet Ligero", color: "#F3E5F5" },
};

export const AircraftTable: React.FC<AircraftTableProps> = ({ aircraft, onView, onEdit }) => {
  return (
    <Table>
      <TableHeader>
        <TableHead style={{ flex: 1 }}>Aeronave</TableHead>
        <TableHead style={{ flex: 1 }}>Base</TableHead>
        <TableHead style={{ flex: 1 }}>Capacidad</TableHead>
        <TableHead style={{ flex: 1 }}>Tipo</TableHead>
        <TableHead style={{ flex: 1 }}>Estado</TableHead>
        <TableHead style={{ flex: 1 }}>Matrícula</TableHead>
        <TableHead style={{ flex: 1 }}>Acción</TableHead>
      </TableHeader>
      <TableBody>
        {aircraft.map((item, index) => (
          <TableRow key={item.id} isLast={index === aircraft.length - 1}>
            <TableCell style={{ flex: 1 }} variant="emphasis">
              {item.name}
            </TableCell>
            <TableCell style={{ flex: 1 }}>{item.base}</TableCell>
            <TableCell style={{ flex: 1 }}>{item.capacity}</TableCell>
            <TableCell style={{ flex: 1 }}>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-md text-caption font-medium"
                style={{
                  backgroundColor: typeConfig[item.type]?.color || "#F5F5F5",
                  color: "#1a1a1a",
                }}
              >
                {typeConfig[item.type]?.label || item.type}
              </span>
            </TableCell>
            <TableCell style={{ flex: 1 }}>
              <StatusBadge status={statusConfig[item.status].status}>
                {statusConfig[item.status].label}
              </StatusBadge>
            </TableCell>
            <TableCell style={{ flex: 1 }} variant="emphasis">
              {item.registration}
            </TableCell>
            <TableCell style={{ flex: 1 }}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onView(item.id)}
                  className="p-0 hover:opacity-70 transition-opacity"
                  aria-label="Ver detalles"
                >
                  <Eye className="w-[18px] h-[18px] text-info" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => onEdit(item.id)}
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
