"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SelectGroup } from "@/components/molecules/SelectGroup";
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
        <div className="w-full px-12 py-6 grid items-end gap-3" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr)) auto" }}>
            <SelectGroup label="Tipo" {...register("type")}>
                <option value="">Todos</option>
                <option value="vlj">Jet Muy Ligero (VLJ)</option>
                <option value="light">Jet Ligero</option>
                <option value="midsize">Jet Mediano</option>
                <option value="super_midsize">Jet Super Mediano</option>
                <option value="heavy">Jet Pesado</option>
                <option value="ultra_long">Ultra Largo Alcance</option>
                <option value="turboprop">Turbohélice</option>
                <option value="piston">Pistón / Hélice</option>
                <option value="helicopter">Helicóptero</option>
            </SelectGroup>

            <SelectGroup label="Capacidad" {...register("capacity")}>
                <option value="">Todas</option>
                <option value="small">1–8 pasajeros</option>
                <option value="medium">9–16 pasajeros</option>
                <option value="large">17+ pasajeros</option>
            </SelectGroup>

            <SelectGroup label="Estado" {...register("status")}>
                <option value="">Todos</option>
                <option value="active">Activo</option>
                <option value="doc_pending">Pendiente de revisión</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="inactive">Inactivo</option>
            </SelectGroup>

            <Button type="button" onClick={handleClear} variant="ghost" className="h-10 px-3 shrink-0">
                Limpiar filtros
            </Button>
        </div>
    );
};
