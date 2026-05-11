"use client";

import React, { useState } from "react";
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
import { Pencil, Eye, Trash2 } from "lucide-react";

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
  aircraft:  Aircraft[];
  onView:    (id: string) => void;
  onEdit:    (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
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

function DeleteCell({ id, onDelete }: { id: string; onDelete: (id: string) => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onDelete(id);
    setIsDeleting(false);
    setConfirming(false);
  };

  if (!confirming) {
    return (
      <IconButton
        onClick={() => setConfirming(true)}
        icon={<Trash2 className="w-[18px] h-[18px] text-red-400" strokeWidth={1.5} />}
        variant="default"
        size="sm"
        aria-label="Eliminar"
      />
    );
  }

  return (
    <div className="flex gap-1.5 items-center">
      <button
        onClick={() => setConfirming(false)}
        disabled={isDeleting}
        className="h-7 px-2 rounded border border-border text-[10px] text-muted hover:bg-[#f6f6f4] transition-colors"
      >
        Cancelar
      </button>
      <button
        onClick={handleConfirm}
        disabled={isDeleting}
        className="h-7 px-2 rounded border border-red-200 text-[10px] text-red-600 hover:bg-red-50 transition-colors"
      >
        {isDeleting ? "..." : "Confirmar"}
      </button>
    </div>
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
                <IconButton
                  onClick={() => onEdit(item.id)}
                  icon={<Pencil className="w-[18px] h-[18px] text-muted" strokeWidth={1.5} />}
                  variant="default"
                  size="sm"
                  aria-label="Editar"
                />
                {onDelete && <DeleteCell id={item.id} onDelete={onDelete} />}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
