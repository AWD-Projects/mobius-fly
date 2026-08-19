"use client";

import * as React from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
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
    const [originQuery, setOriginQuery] = React.useState("");
    const [destinationQuery, setDestinationQuery] = React.useState("");
    const [showOriginDropdown, setShowOriginDropdown] = React.useState(false);
    const [showDestinationDropdown, setShowDestinationDropdown] = React.useState(false);

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
                    <IconButton
                        variant="ghost"
                        size="sm"
                        icon={<X size={20} />}
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="text-muted hover:text-text"
                    />
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
                        {/* Origen combobox */}
                        <Controller
                            name="origin"
                            control={control}
                            render={({ field }) => {
                                const selected = originOptions.find((a) => a.iata_code === field.value);
                                const filtered = originOptions.filter((a) => {
                                    const q = originQuery.toLowerCase();
                                    return !q || a.iata_code.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
                                });
                                return (
                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="text-caption font-medium text-secondary">
                                            Origen <span className="text-error">*</span>
                                        </label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => { setShowOriginDropdown((v) => !v); setShowDestinationDropdown(false); }}
                                                className="flex h-10 w-full items-center justify-between rounded-sm border border-border bg-transparent px-3 text-caption text-text transition-all focus-visible:outline-none focus-visible:border-text focus-visible:border-2"
                                                style={{ color: selected ? "var(--color-text)" : "var(--color-muted)" }}
                                            >
                                                <span>{selected ? `${selected.iata_code} — ${selected.city}` : "Selecciona origen"}</span>
                                                <ChevronDown size={14} className="text-muted shrink-0" />
                                            </button>
                                            {showOriginDropdown && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => { setShowOriginDropdown(false); setOriginQuery(""); }} />
                                                    <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-sm border border-border flex flex-col overflow-hidden" style={{ backgroundColor: "#FBFAF9", boxShadow: "0px 4px 12px rgba(0,0,0,0.12)", maxHeight: "220px" }}>
                                                        <div className="flex items-center gap-2 px-3 py-2 border-b border-border shrink-0">
                                                            <Search size={13} className="text-muted shrink-0" />
                                                            <input
                                                                autoFocus
                                                                type="text"
                                                                value={originQuery}
                                                                onChange={(e) => setOriginQuery(e.target.value)}
                                                                placeholder="Buscar ciudad o código..."
                                                                className="flex-1 text-small bg-transparent focus:outline-none text-text placeholder:text-muted"
                                                            />
                                                        </div>
                                                        <div className="overflow-y-auto overscroll-contain">
                                                            {filtered.map((a) => (
                                                                <button
                                                                    key={a.id}
                                                                    type="button"
                                                                    onClick={() => { field.onChange(a.iata_code); setShowOriginDropdown(false); setOriginQuery(""); }}
                                                                    className="w-full text-left px-3 py-2 text-small hover:bg-neutral/40 transition-colors border-b border-border last:border-0"
                                                                    style={{ color: field.value === a.iata_code ? "var(--color-primary)" : "var(--color-text)", fontWeight: field.value === a.iata_code ? 600 : 400 }}
                                                                >
                                                                    {a.iata_code} — {a.city}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {errors.origin && <p className="text-small text-error">{errors.origin.message}</p>}
                                    </div>
                                );
                            }}
                        />

                        {/* Destino combobox */}
                        <Controller
                            name="destination"
                            control={control}
                            render={({ field }) => {
                                const selected = destinationOptions.find((a) => a.iata_code === field.value);
                                const filtered = destinationOptions.filter((a) => {
                                    const q = destinationQuery.toLowerCase();
                                    return !q || a.iata_code.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
                                });
                                return (
                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="text-caption font-medium text-secondary">
                                            Destino <span className="text-error">*</span>
                                        </label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => { setShowDestinationDropdown((v) => !v); setShowOriginDropdown(false); }}
                                                className="flex h-10 w-full items-center justify-between rounded-sm border border-border bg-transparent px-3 text-caption text-text transition-all focus-visible:outline-none focus-visible:border-text focus-visible:border-2"
                                                style={{ color: selected ? "var(--color-text)" : "var(--color-muted)" }}
                                            >
                                                <span>{selected ? `${selected.iata_code} — ${selected.city}` : "Selecciona destino"}</span>
                                                <ChevronDown size={14} className="text-muted shrink-0" />
                                            </button>
                                            {showDestinationDropdown && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => { setShowDestinationDropdown(false); setDestinationQuery(""); }} />
                                                    <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-sm border border-border flex flex-col overflow-hidden" style={{ backgroundColor: "#FBFAF9", boxShadow: "0px 4px 12px rgba(0,0,0,0.12)", maxHeight: "220px" }}>
                                                        <div className="flex items-center gap-2 px-3 py-2 border-b border-border shrink-0">
                                                            <Search size={13} className="text-muted shrink-0" />
                                                            <input
                                                                autoFocus
                                                                type="text"
                                                                value={destinationQuery}
                                                                onChange={(e) => setDestinationQuery(e.target.value)}
                                                                placeholder="Buscar ciudad o código..."
                                                                className="flex-1 text-small bg-transparent focus:outline-none text-text placeholder:text-muted"
                                                            />
                                                        </div>
                                                        <div className="overflow-y-auto overscroll-contain">
                                                            {filtered.map((a) => (
                                                                <button
                                                                    key={a.id}
                                                                    type="button"
                                                                    onClick={() => { field.onChange(a.iata_code); setShowDestinationDropdown(false); setDestinationQuery(""); }}
                                                                    className="w-full text-left px-3 py-2 text-small hover:bg-neutral/40 transition-colors border-b border-border last:border-0"
                                                                    style={{ color: field.value === a.iata_code ? "var(--color-primary)" : "var(--color-text)", fontWeight: field.value === a.iata_code ? 600 : 400 }}
                                                                >
                                                                    {a.iata_code} — {a.city}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {errors.destination && <p className="text-small text-error">{errors.destination.message}</p>}
                                    </div>
                                );
                            }}
                        />
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
