"use client";

import React, { useState } from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { IconButton } from "@/components/atoms/IconButton";

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  base: string;
  licenses: string[];
  status: "active" | "inactive" | "pending";
}

export interface CrewCardProps {
  member:    CrewMember;
  onView:    (id: string) => void;
  onEdit:    (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
}

const statusConfig = {
  active: { label: "Activo", status: "active" as const },
  inactive: { label: "Inactivo", status: "inactive" as const },
  pending: { label: "Pendiente", status: "pending" as const },
};

export const CrewCard: React.FC<CrewCardProps> = ({ member, onView, onEdit, onDelete }) => {
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(member.name);

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    await onDelete(member.id);
    setIsDeleting(false);
    setConfirming(false);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-[#E3F2FD] flex items-center justify-center flex-shrink-0">
          <span className="text-small font-semibold text-info">{initials}</span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h3 className="text-small font-semibold text-text truncate">{member.name}</h3>
          <p className="text-caption font-medium text-muted truncate">{member.role}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border" />

      {/* Body */}
      <div className="flex flex-col gap-3">
        {/* Base */}
        <div className="flex items-center justify-between">
          <span className="text-caption font-medium text-muted">Base</span>
          <span className="text-caption font-medium text-text">{member.base}</span>
        </div>

        {/* Licenses */}
        <div className="flex items-center justify-between">
          <span className="text-caption font-medium text-muted">Licencias</span>
          <span className="text-caption font-medium text-text text-right">
            {member.licenses.join(", ")}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-caption font-medium text-muted">Estado</span>
          <StatusBadge status={statusConfig[member.status].status}>
            {statusConfig[member.status].label}
          </StatusBadge>
        </div>
      </div>

      {/* Actions */}
      {!confirming ? (
        <div className="flex items-center justify-end gap-2 pt-2">
          <IconButton
            onClick={() => onView(member.id)}
            icon={<Eye className="w-[18px] h-[18px] text-info" strokeWidth={1.5} />}
            variant="default"
            size="sm"
            aria-label="Ver detalles"
          />
          <IconButton
            onClick={() => onEdit(member.id)}
            icon={<Edit2 className="w-[18px] h-[18px] text-muted" strokeWidth={1.5} />}
            variant="default"
            size="sm"
            aria-label="Editar"
          />
          {onDelete && (
            <IconButton
              onClick={() => setConfirming(true)}
              icon={<Trash2 className="w-[18px] h-[18px] text-red-400" strokeWidth={1.5} />}
              variant="default"
              size="sm"
              aria-label="Eliminar"
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 pt-2">
          <p className="text-[10px] text-center text-[#666666]">¿Eliminar tripulante?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              disabled={isDeleting}
              className="flex-1 h-8 rounded-lg border border-border text-[11px] text-muted hover:bg-[#f6f6f4] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="flex-1 h-8 rounded-lg border border-red-200 text-[11px] text-red-600 hover:bg-red-50 transition-colors"
            >
              {isDeleting ? "..." : "Confirmar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
