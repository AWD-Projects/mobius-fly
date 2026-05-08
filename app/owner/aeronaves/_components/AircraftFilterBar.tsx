"use client";

import React from "react";

export interface AircraftFilters {
  base?: string;
  type?: string;
  capacity?: string;
  status?: string;
}

export interface AircraftFilterBarProps {
  filters: AircraftFilters;
  onFiltersChange: (filters: AircraftFilters) => void;
  onClearFilters: () => void;
}

export const AircraftFilterBar: React.FC<AircraftFilterBarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleFilterChange = (key: keyof AircraftFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="w-full px-12 py-6 flex items-end gap-4">
      {/* Base Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Base</label>
        <select
          value={filters.base || ""}
          onChange={(e) => handleFilterChange("base", e.target.value)}
          className="h-10 px-3 rounded-lg border border-border bg-background text-small"
        >
          <option value="">Todas</option>
          <option value="madrid">Madrid (MAD)</option>
          <option value="barcelona">Barcelona (BCN)</option>
          <option value="sevilla">Sevilla (SVQ)</option>
          <option value="malaga">Málaga (AGP)</option>
        </select>
      </div>

      {/* Type Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Tipo</label>
        <select
          value={filters.type || ""}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="h-10 px-3 rounded-lg border border-border bg-background text-small"
        >
          <option value="">Todos</option>
          <option value="jet">Jet Ejecutivo</option>
          <option value="turboprop">Turbohélice</option>
          <option value="light">Jet Ligero</option>
        </select>
      </div>

      {/* Capacity Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Capacidad</label>
        <select
          value={filters.capacity || ""}
          onChange={(e) => handleFilterChange("capacity", e.target.value)}
          className="h-10 px-3 rounded-lg border border-border bg-background text-small"
        >
          <option value="">Todas</option>
          <option value="small">1-8 pasajeros</option>
          <option value="medium">9-16 pasajeros</option>
          <option value="large">17+ pasajeros</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Estado</label>
        <select
          value={filters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="h-10 px-3 rounded-lg border border-border bg-background text-small"
        >
          <option value="">Todos</option>
          <option value="active">Activo</option>
          <option value="maintenance">Mantenimiento</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={onClearFilters}
        className="h-10 px-3 text-small font-medium text-muted hover:text-text transition-colors border border-border rounded-lg"
      >
        Limpiar filtros
      </button>
    </div>
  );
};
