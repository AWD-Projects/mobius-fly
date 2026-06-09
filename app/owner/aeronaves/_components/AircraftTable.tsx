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
import { IconButton } from "@/components/atoms/IconButton";
import { Pencil, Eye, Trash2, PlaneTakeoff } from "lucide-react";

export interface Aircraft {
  id: string;
  name: string;
  base: string;
  capacity: string;
  type: string;
  status: "active" | "maintenance" | "inactive" | "doc_missing" | "doc_pending" | "doc_rejected";
  registration: string;
}

export interface AircraftTableProps {
  aircraft:  Aircraft[];
  onView:    (id: string) => void;
  onEdit:    (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  active:       { label: "Activo",               status: "success"  as const },
  maintenance:  { label: "Mantenimiento",         status: "pending"  as const },
  inactive:     { label: "Inactivo",              status: "inactive" as const },
  doc_missing:  { label: "Doc. faltante",         status: "inactive" as const },
  doc_pending:  { label: "Pendiente de revisión", status: "pending"  as const },
  doc_rejected: { label: "Doc. rechazada",        status: "pending"  as const },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  jet: { label: "Jet Ejecutivo", color: "#E3F2FD" },
  turboprop: { label: "Turbohélice", color: "#FFF3E0" },
  light: { label: "Jet Ligero", color: "#F3E5F5" },
};

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

export const AircraftTable: React.FC<AircraftTableProps> = ({ aircraft, onView, onEdit, onDelete }) => {
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
        {aircraft.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <PlaneTakeoff className="w-8 h-8 text-border" strokeWidth={1.5} />
            <p className="text-small text-muted">No hay aeronaves registradas</p>
          </div>
        )}
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
                <IconButton
                  onClick={() => onView(item.id)}
                  icon={<Eye className="w-[18px] h-[18px] text-info" strokeWidth={1.5} />}
                  variant="default"
                  size="sm"
                  aria-label="Ver detalles"
                />
                {(item.status === "doc_pending" || item.status === "doc_rejected") && (
                  <IconButton
                    onClick={() => onEdit(item.id)}
                    icon={<Pencil className="w-[18px] h-[18px] text-muted" strokeWidth={1.5} />}
                    variant="default"
                    size="sm"
                    aria-label="Editar"
                  />
                )}
                {onDelete && <DeleteCell id={item.id} onDelete={onDelete} />}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
