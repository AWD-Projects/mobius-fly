"use client";

import React from "react";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Button } from "@/components/atoms/Button";

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
          className="h-9 px-3 rounded-sm border border-border bg-transparent text-small text-text transition-all placeholder:text-muted focus-visible:outline-none focus-visible:bg-surface focus-visible:border-text focus-visible:border-2"
        />
      </div>

      {/* Origen Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Origen</label>
        <Input
          type="text"
          placeholder="Todos"
          value={filters.origin || ""}
          onChange={(e) => handleFilterChange("origin", e.target.value)}
          className="h-9"
        />
      </div>

      {/* Destino Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Destino</label>
        <Input
          type="text"
          placeholder="Todos"
          value={filters.destination || ""}
          onChange={(e) => handleFilterChange("destination", e.target.value)}
          className="h-9"
        />
      </div>

      {/* Aeronave Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Aeronave</label>
        <Select
          value={filters.aircraft || ""}
          onChange={(e) => handleFilterChange("aircraft", e.target.value)}
          className="h-9"
        >
          <option value="">Todas</option>
          <option value="citation-cj3">Citation CJ3+</option>
          <option value="phenom-300">Phenom 300</option>
          <option value="legacy-500">Legacy 500</option>
        </Select>
      </div>

      {/* Tipo Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Tipo</label>
        <Select
          value={filters.type || ""}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="h-9"
        >
          <option value="">Todos</option>
          <option value="charter">Charter</option>
          <option value="personal">Personal</option>
        </Select>
      </div>

      {/* Estado Filter */}
      <div className="flex flex-col gap-1.5 w-[140px]">
        <label className="text-caption font-medium text-muted">Estado</label>
        <Select
          value={filters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="h-9"
        >
          <option value="">Todos</option>
          <option value="scheduled">Programado</option>
          <option value="in-flight">En vuelo</option>
          <option value="confirmed">Confirmado</option>
        </Select>
      </div>

      {/* Clear Filters Button */}
      <Button
        onClick={onClearFilters}
        variant="ghost"
        className="h-9 px-3"
      >
        Limpiar filtros
      </Button>
    </div>
  );
};
