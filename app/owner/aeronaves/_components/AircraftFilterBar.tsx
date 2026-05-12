"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Select } from "@/components/atoms/Select";
import { Button } from "@/components/atoms/Button";

export interface AircraftFilters {
    type?:     string;
    capacity?: string;
    status?:   string;
}

export interface AircraftFilterBarProps {
    filters:         AircraftFilters;
    onFiltersChange: (filters: AircraftFilters) => void;
    onClearFilters:  () => void;
}

export const AircraftFilterBar: React.FC<AircraftFilterBarProps> = ({ filters, onFiltersChange, onClearFilters }) => {
    const { register, watch, reset } = useForm<AircraftFilters>({ defaultValues: filters });

    useEffect(() => {
        const { unsubscribe } = watch((values) => onFiltersChange(values as AircraftFilters));
        return unsubscribe;
    }, [watch, onFiltersChange]);

    const handleClear = () => {
        reset({ type: "", capacity: "", status: "" });
        onClearFilters();
    };

    return (
        <div className="w-full px-12 py-6 flex items-end gap-4">
            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Tipo</label>
                <Select {...register("type")}>
                    <option value="">Todos</option>
                    <option value="jet">Jet Ejecutivo</option>
                    <option value="turboprop">Turbohélice</option>
                    <option value="light">Jet Ligero</option>
                </Select>
            </div>

            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Capacidad</label>
                <Select {...register("capacity")}>
                    <option value="">Todas</option>
                    <option value="small">1-8 pasajeros</option>
                    <option value="medium">9-16 pasajeros</option>
                    <option value="large">17+ pasajeros</option>
                </Select>
            </div>

            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Estado</label>
                <Select {...register("status")}>
                    <option value="">Todos</option>
                    <option value="active">Activo</option>
                    <option value="maintenance">Mantenimiento</option>
                    <option value="inactive">Inactivo</option>
                </Select>
            </div>

            <Button type="button" onClick={handleClear} variant="outline" className="h-10 px-3">
                Limpiar filtros
            </Button>
        </div>
    );
};
