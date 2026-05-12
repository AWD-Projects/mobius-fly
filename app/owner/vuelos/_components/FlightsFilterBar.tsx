"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
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

export const FlightsFilterBar: React.FC<FlightsFilterBarProps> = ({ filters, onFiltersChange, onClearFilters }) => {
    const { register, watch, reset } = useForm<FlightsFilters>({ defaultValues: filters });

    useEffect(() => {
        const { unsubscribe } = watch((values) => {
            const clean = Object.fromEntries(
                Object.entries(values).filter(([, v]) => v !== "" && v !== undefined),
            ) as FlightsFilters;
            onFiltersChange(clean);
        });
        return unsubscribe;
    }, [watch, onFiltersChange]);

    const handleClear = () => {
        reset({ date: "", origin: "", destination: "", aircraft: "", type: "", status: "" });
        onClearFilters();
    };

    return (
        <div className="w-full px-12 py-6 flex items-end gap-4">
            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Fecha</label>
                <input
                    type="date"
                    className="h-9 px-3 rounded-sm border border-border bg-transparent text-small text-text transition-all placeholder:text-muted focus-visible:outline-none focus-visible:bg-surface focus-visible:border-text focus-visible:border-2"
                    {...register("date")}
                />
            </div>

            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Origen</label>
                <Input type="text" placeholder="p. ej. MEX" className="h-9" {...register("origin")} />
            </div>

            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Destino</label>
                <Input type="text" placeholder="p. ej. CUN" className="h-9" {...register("destination")} />
            </div>

            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Aeronave</label>
                <Input type="text" placeholder="Todas" className="h-9" {...register("aircraft")} />
            </div>

            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Tipo</label>
                <Select className="h-9" {...register("type")}>
                    <option value="">Todos</option>
                    <option value="charter">Sencillo</option>
                    <option value="personal">Redondo</option>
                </Select>
            </div>

            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Estado</label>
                <Select className="h-9" {...register("status")}>
                    <option value="">Todos</option>
                    <option value="scheduled">Programado</option>
                    <option value="delayed">Retrasado</option>
                    <option value="in-flight">En vuelo</option>
                    <option value="confirmed">A tiempo</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                </Select>
            </div>

            <Button type="button" onClick={handleClear} variant="ghost" className="h-9 px-3">
                Limpiar filtros
            </Button>
        </div>
    );
};
