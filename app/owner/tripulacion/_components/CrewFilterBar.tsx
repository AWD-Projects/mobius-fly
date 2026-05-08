"use client";

import React from "react";

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
        <select
          value={filters.role || ""}
          onChange={(e) => handleFilterChange("role", e.target.value)}
          className="h-10 px-3 rounded-lg border border-border bg-background text-small"
        >
          <option value="">Todos</option>
          <option value="pilot">Piloto</option>
          <option value="copilot">Copiloto</option>
          <option value="cabin-crew">TCP</option>
        </select>
      </div>

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
        </select>
      </div>

      {/* Estado Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Estado</label>
        <select
          value={filters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="h-10 px-3 rounded-lg border border-border bg-background text-small"
        >
          <option value="">Todos</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="pending">Pendiente</option>
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
