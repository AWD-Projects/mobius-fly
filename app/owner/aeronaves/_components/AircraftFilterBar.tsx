"use client";

import React from "react";
import { Select } from "@/components/atoms/Select";
import { Button } from "@/components/atoms/Button";

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
        <Select
          value={filters.base || ""}
          onChange={(e) => handleFilterChange("base", e.target.value)}
        >
          <option value="">Todas</option>
          <option value="madrid">Madrid (MAD)</option>
          <option value="barcelona">Barcelona (BCN)</option>
          <option value="sevilla">Sevilla (SVQ)</option>
          <option value="malaga">Málaga (AGP)</option>
        </Select>
      </div>

      {/* Type Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Tipo</label>
        <Select
          value={filters.type || ""}
          onChange={(e) => handleFilterChange("type", e.target.value)}
        >
          <option value="">Todos</option>
          <option value="jet">Jet Ejecutivo</option>
          <option value="turboprop">Turbohélice</option>
          <option value="light">Jet Ligero</option>
        </Select>
      </div>

      {/* Capacity Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Capacidad</label>
        <Select
          value={filters.capacity || ""}
          onChange={(e) => handleFilterChange("capacity", e.target.value)}
        >
          <option value="">Todas</option>
          <option value="small">1-8 pasajeros</option>
          <option value="medium">9-16 pasajeros</option>
          <option value="large">17+ pasajeros</option>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Estado</label>
        <Select
          value={filters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">Todos</option>
          <option value="active">Activo</option>
          <option value="maintenance">Mantenimiento</option>
          <option value="inactive">Inactivo</option>
        </Select>
      </div>

      {/* Clear Filters Button */}
      <Button
        onClick={onClearFilters}
        variant="outline"
        className="h-10 px-3"
      >
        Limpiar filtros
      </Button>
    </div>
  );
};
