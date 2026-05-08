"use client";

import React from "react";
import { Plane, ArrowRight } from "lucide-react";

export interface AircraftInfoCardProps {
  model: string;
  registration: string;
  base: string;
  capacity: string;
  type: string;
  status: "active" | "maintenance" | "inactive";
  onViewAircraft?: () => void;
}

const statusConfig = {
  active: { label: "Activo", color: "#E8F5E9", textColor: "#2E7D32" },
  maintenance: { label: "Mantenimiento", color: "#FFF8E1", textColor: "#F57F17" },
  inactive: { label: "Inactivo", color: "#F5F5F5", textColor: "#999999" },
};

export const AircraftInfoCard: React.FC<AircraftInfoCardProps> = ({
  model,
  registration,
  base,
  capacity,
  type,
  status,
  onViewAircraft,
}) => {
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[11px] font-semibold text-text">Aeronave asignada</h2>
        {onViewAircraft && (
          <button
            onClick={onViewAircraft}
            className="flex items-center gap-1 text-xs font-medium text-[#666666] hover:text-text transition-colors"
          >
            <span>Ver aeronave</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Card */}
      <div className="w-full bg-white rounded-2xl border border-border p-7 flex items-center gap-7">
        {/* Aircraft Icon */}
        <div className="w-20 h-20 rounded-xl bg-[#FAFAFA] flex items-center justify-center flex-shrink-0">
          <Plane className="w-8 h-8 text-[#CCCCCC]" />
        </div>

        {/* Aircraft Info */}
        <div className="flex flex-col gap-3 flex-1">
          {/* Model & Status */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium text-text">{model}</span>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded"
              style={{
                backgroundColor: statusConfig[status].color,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusConfig[status].textColor }}
              />
              <span
                className="text-[11px] font-medium"
                style={{ color: statusConfig[status].textColor }}
              >
                {statusConfig[status].label}
              </span>
            </div>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-medium text-muted">Matrícula</span>
              <span className="text-sm font-medium text-text">{registration}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-medium text-muted">Base</span>
              <span className="text-sm font-medium text-text">{base}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-medium text-muted">Capacidad</span>
              <span className="text-sm font-medium text-text">{capacity}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-medium text-muted">Tipo</span>
              <span className="text-sm font-medium text-text">{type}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
