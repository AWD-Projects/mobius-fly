"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/atoms/Button";
import { SelectGroup } from "@/components/molecules/SelectGroup";
import { InputGroup } from "@/components/molecules/InputGroup";
import { NumericCounter } from "@/components/molecules/NumericCounter";
import { getAirports } from "@/app/actions/flights";
import type { Airport } from "@/types/app.types";

// ─── Schema ───────────────────────────────────────────────────────────────────

const todayISO = () => new Date().toISOString().split("T")[0];

const schema = z
    .object({
        origin: z.string().min(1, "Origen requerido"),
        destination: z.string().min(1, "Destino requerido"),
        date: z.string().min(1, "Fecha de salida requerida"),
        returnDate: z.string().optional(),
        type: z.enum(["one_way", "round_trip"]),
        passengers: z.number().min(1, "Mínimo 1 pasajero").max(20),
    })
    .refine((d) => d.origin !== d.destination, {
        message: "El origen y destino no pueden ser iguales",
        path: ["destination"],
    })
    .refine((d) => !d.date || d.date >= todayISO(), {
        message: "La fecha de salida no puede ser anterior a hoy",
        path: ["date"],
    })
    .refine((d) => d.type !== "round_trip" || !!d.returnDate, {
        message: "Fecha de vuelta requerida para vuelo redondo",
        path: ["returnDate"],
    })
    .refine((d) => !d.returnDate || !d.date || d.returnDate >= d.date, {
        message: "La fecha de vuelta no puede ser anterior a la de salida",
        path: ["returnDate"],
    });

export type ModifySearchValues = z.infer<typeof schema>;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ModifySearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialValues?: Partial<ModifySearchValues>;
    onSearch: (values: ModifySearchValues) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ModifySearchModal: React.FC<ModifySearchModalProps> = ({
    isOpen,
    onClose,
    initialValues,
    onSearch,
}) => {
    const [airports, setAirports] = React.useState<Airport[]>([]);

    React.useEffect(() => {
        getAirports().then(setAirports);
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
        reset,
    } = useForm<ModifySearchValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            origin: initialValues?.origin ?? "",
            destination: initialValues?.destination ?? "",
            date: initialValues?.date ?? "",
            returnDate: initialValues?.returnDate ?? "",
            type: initialValues?.type ?? "one_way",
            passengers: initialValues?.passengers ?? 1,
        },
    });

    const [isSearching, setIsSearching] = React.useState(false);

    const watchedType = watch("type");
    const watchedDate = watch("date");
    const watchedOrigin = watch("origin");
    const watchedDestination = watch("destination");

    React.useEffect(() => {
        if (isOpen) {
            setIsSearching(false);
            reset({
                origin: initialValues?.origin ?? "",
                destination: initialValues?.destination ?? "",
                date: initialValues?.date ?? "",
                returnDate: initialValues?.returnDate ?? "",
                type: initialValues?.type ?? "one_way",
                passengers: initialValues?.passengers ?? 1,
            });
        }
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!isOpen) return null;

    const originOptions = airports.filter((a) => a.iata_code !== watchedDestination);
    const destinationOptions = airports.filter((a) => a.iata_code !== watchedOrigin);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal card */}
            <div className="relative z-10 w-full max-w-[500px] bg-surface rounded-md border border-border shadow-lg p-6 sm:p-8 flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-body font-semibold text-text">Modificar búsqueda</h2>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-text transition-colors"
                        aria-label="Cerrar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit((values) => {
                        setIsSearching(true);
                        onSearch(values);
                    })}
                    noValidate
                    className="flex flex-col gap-5"
                >
                    {/* Origen + Destino */}
                    <div className="flex gap-4">
                        <SelectGroup
                            label="Origen"
                            required
                            className="flex-1"
                            error={errors.origin?.message}
                            {...register("origin")}
                        >
                            <option value="">Selecciona origen</option>
                            {originOptions.map((a) => (
                                <option key={a.id} value={a.iata_code}>
                                    {a.iata_code} — {a.city}
                                </option>
                            ))}
                        </SelectGroup>
                        <SelectGroup
                            label="Destino"
                            required
                            className="flex-1"
                            error={errors.destination?.message}
                            {...register("destination")}
                        >
                            <option value="">Selecciona destino</option>
                            {destinationOptions.map((a) => (
                                <option key={a.id} value={a.iata_code}>
                                    {a.iata_code} — {a.city}
                                </option>
                            ))}
                        </SelectGroup>
                    </div>

                    {/* Fechas */}
                    <div className="flex gap-4">
                        <InputGroup
                            label="Fecha de salida"
                            type="date"
                            required
                            className="flex-1"
                            min={todayISO()}
                            error={errors.date?.message}
                            {...register("date")}
                        />
                        {watchedType === "round_trip" && (
                            <InputGroup
                                label="Fecha de vuelta"
                                type="date"
                                required
                                className="flex-1"
                                min={watchedDate || todayISO()}
                                error={errors.returnDate?.message}
                                {...register("returnDate")}
                            />
                        )}
                    </div>

                    {/* Tipo + Pasajeros */}
                    <div className="flex items-start gap-4">
                        <SelectGroup
                            label="Tipo de vuelo"
                            className="flex-1"
                            error={errors.type?.message}
                            {...register("type")}
                        >
                            <option value="one_way">Sencillo</option>
                            <option value="round_trip">Redondo</option>
                        </SelectGroup>

                        <div className="flex flex-col gap-2 flex-shrink-0">
                            <span className="text-caption font-medium text-muted">Pasajeros</span>
                            <Controller
                                name="passengers"
                                control={control}
                                render={({ field }) => (
                                    <NumericCounter
                                        value={field.value}
                                        onChange={field.onChange}
                                        min={1}
                                        max={20}
                                    />
                                )}
                            />
                            {errors.passengers && (
                                <span className="text-caption text-error">
                                    {errors.passengers.message}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="md"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="secondary"
                            size="md"
                            className="flex-1"
                            disabled={isSearching}
                            isLoading={isSearching}
                        >
                            {isSearching ? "Buscando..." : "Buscar vuelos"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
