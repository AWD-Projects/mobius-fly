"use client";

import React from "react";
import { Select } from "@/components/atoms/Select";
import { Button } from "@/components/atoms/Button";

export interface CrewFilters {
  role?: string;
  base?: string;
  status?: string;
}

export interface CrewFilterBarProps {
  filters: CrewFilters;
  onFiltersChange: (filters: CrewFilters) => void;
  onClearFilters: () => void;
}

export const CrewFilterBar: React.FC<CrewFilterBarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleFilterChange = (key: keyof CrewFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="w-full px-12 py-6 flex items-end gap-4">
      {/* Rol Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Rol</label>
        <Select
          value={filters.role || ""}
          onChange={(e) => handleFilterChange("role", e.target.value)}
        >
          <option value="">Todos</option>
          <option value="pilot">Piloto</option>
          <option value="copilot">Copiloto</option>
          <option value="cabin-crew">TCP</option>
        </Select>
      </div>

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
        </Select>
      </div>

      {/* Estado Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Estado</label>
        <Select
          value={filters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">Todos</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="pending">Pendiente</option>
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
