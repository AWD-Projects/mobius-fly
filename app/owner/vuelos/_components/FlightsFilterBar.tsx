"use client";

import React from "react";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Button } from "@/components/atoms/Button";

export interface FlightsFilters {
    date?:        string;
    origin?:      string;
    destination?: string;
    aircraft?:    string;
    type?:        string;
    status?:      string;
}

export interface FlightsFilterBarProps {
    filters:         FlightsFilters;
    onFiltersChange: (filters: FlightsFilters) => void;
    onClearFilters:  () => void;
}

export const FlightsFilterBar: React.FC<FlightsFilterBarProps> = ({
    filters,
    onFiltersChange,
    onClearFilters,
}) => {
    const set = (key: keyof FlightsFilters) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            onFiltersChange({ ...filters, [key]: e.target.value || undefined });

    return (
        <div className="w-full px-12 py-6 flex items-end gap-4">
            {/* Fecha */}
            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Fecha</label>
                <input
                    type="date"
                    value={filters.date || ""}
                    onChange={set("date")}
                    className="h-9 px-3 rounded-sm border border-border bg-transparent text-small text-text transition-all placeholder:text-muted focus-visible:outline-none focus-visible:bg-surface focus-visible:border-text focus-visible:border-2"
                />
            </div>

            {/* Origen */}
            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Origen</label>
                <Input
                    type="text"
                    placeholder="p. ej. MEX"
                    value={filters.origin || ""}
                    onChange={set("origin")}
                    className="h-9"
                />
            </div>

            {/* Destino */}
            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Destino</label>
                <Input
                    type="text"
                    placeholder="p. ej. CUN"
                    value={filters.destination || ""}
                    onChange={set("destination")}
                    className="h-9"
                />
            </div>

            {/* Aeronave */}
            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Aeronave</label>
                <Input
                    type="text"
                    placeholder="Todas"
                    value={filters.aircraft || ""}
                    onChange={set("aircraft")}
                    className="h-9"
                />
            </div>

            {/* Tipo */}
            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Tipo</label>
                <Select value={filters.type || ""} onChange={set("type")} className="h-9">
                    <option value="">Todos</option>
                    <option value="charter">Sencillo</option>
                    <option value="personal">Redondo</option>
                </Select>
            </div>

            {/* Estado */}
            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Estado</label>
                <Select value={filters.status || ""} onChange={set("status")} className="h-9">
                    <option value="">Todos</option>
                    <option value="scheduled">Programado</option>
                    <option value="delayed">Retrasado</option>
                    <option value="in-flight">En vuelo</option>
                    <option value="confirmed">A tiempo</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                </Select>
            </div>

            <Button onClick={onClearFilters} variant="ghost" className="h-9 px-3">
                Limpiar filtros
            </Button>
        </div>
    );
};
