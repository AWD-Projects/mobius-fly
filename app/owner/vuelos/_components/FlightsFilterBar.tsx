"use client";

import React from "react";
import { Select } from "@/components/atoms/Select";

export interface FlightsFilters {
  date?: string;
  origin?: string;
  destination?: string;
  aircraft?: string;
  type?: string;
  status?: string;
}

export interface FlightsFilterBarProps {
  filters: FlightsFilters;
  onFiltersChange: (filters: FlightsFilters) => void;
  onClearFilters: () => void;
}

export const FlightsFilterBar: React.FC<FlightsFilterBarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleFilterChange = (key: keyof FlightsFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="w-full px-12 py-6 flex items-end gap-4">
      {/* Fecha Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Fecha</label>
        <input
          type="date"
          value={filters.date || ""}
          onChange={(e) => handleFilterChange("date", e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-transparent text-small"
        />
      </div>

      {/* Origen Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Origen</label>
        <input
          type="text"
          placeholder="Todos"
          value={filters.origin || ""}
          onChange={(e) => handleFilterChange("origin", e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-transparent text-small"
        />
      </div>

      {/* Destino Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Destino</label>
        <input
          type="text"
          placeholder="Todos"
          value={filters.destination || ""}
          onChange={(e) => handleFilterChange("destination", e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-transparent text-small"
        />
      </div>

      {/* Aeronave Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Aeronave</label>
        <select
          value={filters.aircraft || ""}
          onChange={(e) => handleFilterChange("aircraft", e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-transparent text-small"
        >
          <option value="">Todas</option>
          <option value="citation-cj3">Citation CJ3+</option>
          <option value="phenom-300">Phenom 300</option>
          <option value="legacy-500">Legacy 500</option>
        </select>
      </div>

      {/* Tipo Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Tipo</label>
        <select
          value={filters.type || ""}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-transparent text-small"
        >
          <option value="">Todos</option>
          <option value="charter">Charter</option>
          <option value="personal">Personal</option>
        </select>
      </div>

      {/* Estado Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Estado</label>
        <select
          value={filters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-transparent text-small"
        >
          <option value="">Todos</option>
          <option value="scheduled">Programado</option>
          <option value="in-flight">En vuelo</option>
          <option value="confirmed">Confirmado</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={onClearFilters}
        className="h-9 px-3 text-small font-medium text-muted hover:text-text transition-colors"
      >
        Limpiar filtros
      </button>
    </div>
  );
};
