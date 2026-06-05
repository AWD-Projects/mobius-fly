"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SelectGroup } from "@/components/molecules/SelectGroup";
import { Button } from "@/components/atoms/Button";

export interface CrewFilters {
    role?:   string;
    status?: string;
}

export interface CrewFilterBarProps {
    filters:         CrewFilters;
    onFiltersChange: (filters: CrewFilters) => void;
    onClearFilters:  () => void;
}

export const CrewFilterBar: React.FC<CrewFilterBarProps> = ({ filters, onFiltersChange, onClearFilters }) => {
    const { register, watch, reset } = useForm<CrewFilters>({ defaultValues: filters });

    useEffect(() => {
        const { unsubscribe } = watch((values) => onFiltersChange(values as CrewFilters));
        return unsubscribe;
    }, [watch, onFiltersChange]);

    const handleClear = () => {
        reset({ role: "", status: "" });
        onClearFilters();
    };

    return (
        <div className="w-full px-12 py-6 grid items-end gap-3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr)) auto" }}>
            <SelectGroup label="Rol" {...register("role")}>
                <option value="">Todos</option>
                <option value="pilot">Capitán</option>
                <option value="copilot">Copiloto</option>
                <option value="cabin-crew">TCP</option>
            </SelectGroup>

            <SelectGroup label="Estado" {...register("status")}>
                <option value="">Todos</option>
                <option value="active">Activo</option>
                <option value="pending">Pendiente de aprobación</option>
                <option value="rejected">Rechazado</option>
                <option value="inactive">Inactivo</option>
            </SelectGroup>

            <Button type="button" onClick={handleClear} variant="ghost" className="h-10 px-3 shrink-0">
                Limpiar filtros
            </Button>
        </div>
    );
};
