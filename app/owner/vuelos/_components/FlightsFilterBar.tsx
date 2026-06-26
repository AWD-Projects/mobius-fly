"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SelectGroup } from "@/components/molecules/SelectGroup";
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
    airports:        { iata_code: string; city: string }[];
    aircraftOptions: { id: string; model: string }[];
}

export const FlightsFilterBar: React.FC<FlightsFilterBarProps> = ({
    filters,
    onFiltersChange,
    onClearFilters,
    airports,
    aircraftOptions,
}) => {
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
        <div className="w-full px-12 py-6 grid items-end gap-3" style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr)) auto" }}>
            <div className="flex flex-col gap-1.5">
                <label className="block text-small font-medium tracking-[0.01em] text-secondary mb-2">Fecha</label>
                <input
                    type="date"
                    className="flex h-10 w-full appearance-none rounded-sm border border-border bg-surface px-3 py-2 text-small text-text transition-all focus-visible:outline-none focus-visible:border-text focus-visible:border-2"
                    {...register("date")}
                />
            </div>

            <SelectGroup label="Origen" {...register("origin")}>
                <option value="">Todos</option>
                {airports.map((a) => (
                    <option key={a.iata_code} value={a.iata_code}>
                        {a.iata_code} — {a.city}
                    </option>
                ))}
            </SelectGroup>

            <SelectGroup label="Destino" {...register("destination")}>
                <option value="">Todos</option>
                {airports.map((a) => (
                    <option key={a.iata_code} value={a.iata_code}>
                        {a.iata_code} — {a.city}
                    </option>
                ))}
            </SelectGroup>

            <SelectGroup label="Aeronave" {...register("aircraft")}>
                <option value="">Todas</option>
                {aircraftOptions.map((a) => (
                    <option key={a.id} value={a.model}>
                        {a.model}
                    </option>
                ))}
            </SelectGroup>

            <SelectGroup label="Tipo" {...register("type")}>
                <option value="">Todos</option>
                <option value="charter">Sencillo</option>
                <option value="personal">Redondo</option>
            </SelectGroup>

            <SelectGroup label="Estado" {...register("status")}>
                <option value="">Todos</option>
                <option value="pending_review">En revisión</option>
                <option value="rejected">Rechazado</option>
                <option value="scheduled">Programado</option>
                <option value="delayed">Retrasado</option>
                <option value="in-flight">En vuelo</option>
                <option value="confirmed">A tiempo</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
            </SelectGroup>

            <Button type="button" onClick={handleClear} variant="ghost" className="h-10 px-3 shrink-0">
                Limpiar
            </Button>
        </div>
    );
};
