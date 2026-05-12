"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Select } from "@/components/atoms/Select";
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
        <div className="w-full px-12 py-6 flex items-end gap-4">
            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Rol</label>
                <Select {...register("role")}>
                    <option value="">Todos</option>
                    <option value="pilot">Piloto</option>
                    <option value="copilot">Copiloto</option>
                    <option value="cabin-crew">TCP</option>
                </Select>
            </div>

            <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-caption font-medium text-muted">Estado</label>
                <Select {...register("status")}>
                    <option value="">Todos</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="pending">Pendiente</option>
                </Select>
            </div>

            <Button type="button" onClick={handleClear} variant="outline" className="h-10 px-3">
                Limpiar filtros
            </Button>
        </div>
    );
};
