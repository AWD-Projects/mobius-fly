"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InputGroup } from "@/components/molecules/InputGroup";
import { SelectGroup } from "@/components/molecules/SelectGroup";
import { NumericCounter } from "@/components/molecules/NumericCounter";
import { DocumentUpload, formatFileSize } from "@/components/molecules/DocumentUpload";
import { toast } from "@/components/atoms/Toast";
import { createClient } from "@/lib/supabase/client";
import { createFlight } from "@/app/actions/flights";
import { getAvailableAircraftForTimeSlot } from "@/app/actions/aircraft";
import { getAvailableCrewForTimeSlot } from "@/app/actions/crew";
import type { Airport } from "@/types/app.types";
import type { AircraftListItem } from "@/app/actions/aircraft";
import type { CrewListItem } from "@/app/actions/crew";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    ownerId:  string;
    airports: Airport[];
    aircraft: AircraftListItem[];
    crew:     CrewListItem[];
}

type FlightType = "sencillo" | "redondo";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    originId:       z.string().min(1, "Selecciona el aeropuerto de origen"),
    destinationId:  z.string().min(1, "Selecciona el aeropuerto de destino"),
    fboOrigin:      z.string().optional(),
    fboDestination: z.string().optional(),
    departureDate:  z.string().min(1, "Fecha requerida"),
    departureTime:  z.string().min(1, "Hora requerida"),
    arrivalDate:    z.string().min(1, "Fecha requerida"),
    arrivalTime:    z.string().min(1, "Hora requerida"),
    returnDate:     z.string().optional(),
    returnTime:     z.string().optional(),
    aircraftId:     z.string().min(1, "Selecciona una aeronave"),
    captainId:      z.string().min(1, "Selecciona un capitán"),
    additionalCrew: z.array(z.object({ id: z.string() })).optional(),
    seatsForSale:   z.number().min(1),
    pricePerSeat:   z.string().refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "Precio inválido"),
}).refine(
    (d) => !d.originId || !d.destinationId || d.originId !== d.destinationId,
    { message: "El destino debe ser diferente al origen", path: ["destinationId"] },
).refine(
    (d) => {
        if (!d.departureDate || !d.departureTime || !d.arrivalDate || !d.arrivalTime) return true;
        return `${d.arrivalDate}T${d.arrivalTime}` > `${d.departureDate}T${d.departureTime}`;
    },
    { message: "La llegada debe ser posterior a la salida", path: ["arrivalDate"] },
);

type FormData = z.infer<typeof schema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISO(date: string, time: string): string {
    return `${date}T${time}:00`;
}

function airportLabel(a: Airport): string {
    return `${a.city} (${a.iata_code})`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateFlightContent({ ownerId, airports, aircraft, crew }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [flightType, setFlightType] = useState<FlightType>("sencillo");
    const [flightPlan, setFlightPlan] = useState<File | null>(null);
    const [filteredAircraft, setFilteredAircraft] = useState<AircraftListItem[]>(aircraft);
    const [filteredCrew, setFilteredCrew] = useState<CrewListItem[]>(crew);
    const [loadingAircraft, setLoadingAircraft] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            originId: "", destinationId: "", fboOrigin: "", fboDestination: "",
            departureDate: "", departureTime: "", arrivalDate: "", arrivalTime: "",
            returnDate: "", returnTime: "",
            aircraftId: "", captainId: "",
            additionalCrew: [],
            seatsForSale: 4, pricePerSeat: "",
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "additionalCrew" });

    const [
        departureDate, departureTime, arrivalDate, arrivalTime,
        aircraftId, captainId, additionalCrew, seatsForSale, pricePerSeat,
        originId, destinationId,
    ] = watch([
        "departureDate", "departureTime", "arrivalDate", "arrivalTime",
        "aircraftId", "captainId", "additionalCrew", "seatsForSale", "pricePerSeat",
        "originId", "destinationId",
    ]);

    // Filter available aircraft and crew when all 4 date/time fields are set
    const canCheck = !!(departureDate && departureTime && arrivalDate && arrivalTime);
    const availableAircraft = canCheck ? filteredAircraft : aircraft;
    const availableCrew     = canCheck ? filteredCrew : crew;

    useEffect(() => {
        if (!canCheck) return;

        clearErrors(["aircraftId", "captainId"]);

        let cancelled = false;

        const fetchAvailable = async () => {
            setLoadingAircraft(true);
            const departure = toISO(departureDate, departureTime);
            const arrival   = toISO(arrivalDate, arrivalTime);

            const [aircraftList, crewList] = await Promise.all([
                getAvailableAircraftForTimeSlot(ownerId, departure, arrival),
                getAvailableCrewForTimeSlot(ownerId, departure, arrival),
            ]);
            if (cancelled) return;

            setFilteredAircraft(aircraftList);
            setFilteredCrew(crewList);

            if (aircraftId && !aircraftList.find((a) => a.id === aircraftId)) {
                setValue("aircraftId", "");
                setError("aircraftId", { message: "La aeronave seleccionada no está disponible en ese horario" });
            } else {
                clearErrors("aircraftId");
            }
            if (captainId && !crewList.find((c) => c.id === captainId)) {
                setValue("captainId", "");
                setError("captainId", { message: "El capitán seleccionado no está disponible en ese horario" });
            } else {
                clearErrors("captainId");
            }
            const availableIds = new Set(crewList.map((c) => c.id));
            (additionalCrew ?? []).forEach((entry, i) => {
                if (entry.id && !availableIds.has(entry.id)) setValue(`additionalCrew.${i}.id`, "");
            });

            setLoadingAircraft(false);
        };

        fetchAvailable();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departureDate, departureTime, arrivalDate, arrivalTime, canCheck]);

    useEffect(() => {
        if (!(departureDate && departureTime && arrivalDate && arrivalTime)) return;
        const dep = `${departureDate}T${departureTime}`;
        const arr = `${arrivalDate}T${arrivalTime}`;
        if (arr <= dep) {
            setError("arrivalDate", { type: "manual", message: "La llegada debe ser posterior a la salida" });
        } else {
            clearErrors("arrivalDate");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departureDate, departureTime, arrivalDate, arrivalTime]);

    const selectedAircraft = aircraft.find((a) => a.id === aircraftId);
    const priceNum         = parseFloat(pricePerSeat) || 0;
    const fullPrice        = priceNum * (selectedAircraft?.seats ?? seatsForSale);

    const captains        = availableCrew.filter((c) => c.crew_role?.code === "CAPTAIN");
    const otherCrew       = availableCrew;
    const usedCrewIds     = new Set([captainId, ...(additionalCrew ?? []).map((c) => c.id)].filter(Boolean));

    const uploadFlightPlan = async (userId: string): Promise<string | null> => {
        if (!flightPlan) return null;
        const supabase = createClient();
        if (!supabase) return null;
        const ext  = flightPlan.name.split(".").pop();
        const path = `${userId}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("flight-plans").upload(path, flightPlan);
        if (error) { console.error("[uploadFlightPlan]", error.message); return null; }
        const { data } = await supabase.storage.from("flight-plans").createSignedUrl(path, 60 * 60 * 24 * 365);
        return data?.signedUrl ?? null;
    };

    const onSubmit = (isVisible: boolean) => handleSubmit(async (data) => {
        startTransition(async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase!.auth.getUser();
            const uid = user?.id ?? ownerId;

            const flightPlanUrl = await uploadFlightPlan(uid);
            const allCrew = [data.captainId, ...(data.additionalCrew ?? []).map((c) => c.id).filter(Boolean)];

            const { error, id } = await createFlight(ownerId, {
                flightType:              flightType === "redondo" ? "ROUND_TRIP" : "ONE_WAY",
                departureAirportId:      data.originId,
                arrivalAirportId:        data.destinationId,
                departureFboName:        data.fboOrigin ?? "",
                arrivalFboName:          data.fboDestination ?? "",
                departureDatetime:       toISO(data.departureDate, data.departureTime),
                arrivalDatetime:         toISO(data.arrivalDate, data.arrivalTime),
                returnDepartureDatetime: flightType === "redondo" && data.returnDate && data.returnTime
                    ? toISO(data.returnDate, data.returnTime)
                    : null,
                aircraftId:              data.aircraftId,
                totalSeats:              data.seatsForSale,
                pricePerSeat:            priceNum,
                priceFullAircraft:       fullPrice,
                flightPlanUrl,
                isVisible,
                crewMemberIds:           allCrew,
            });

            if (error) {
                toast.error("Error al crear el vuelo", error);
            } else {
                toast.success(
                    isVisible ? "Vuelo publicado" : "Borrador guardado",
                    isVisible ? "El vuelo ya es visible para compradores" : "Puedes publicarlo desde el detalle del vuelo",
                );
                router.push(id ? `/owner/vuelos/${id}` : "/owner/vuelos");
            }
        });
    })();

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <Button onClick={() => router.push("/owner/vuelos")} variant="link" className="flex items-center gap-3 mb-5 p-0 text-xs font-medium text-muted hover:text-text">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a vuelos
                </Button>
                <div className="flex flex-col gap-2">
                    <h1 className="text-[26px] font-semibold text-text">Crear vuelo</h1>
                    <p className="text-sm text-muted">Configura y publica tu vuelo para que los compradores lo vean</p>
                </div>
            </div>

            <div className="px-12 pb-8 flex flex-col gap-7">
                {/* Type Toggle */}
                <div className="flex">
                    {(["sencillo", "redondo"] as FlightType[]).map((t, i) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setFlightType(t)}
                            className={`flex-1 h-11 border border-border transition-colors ${i === 0 ? "rounded-l-xl" : "rounded-r-xl border-l-0"} ${flightType === t ? "bg-white text-text font-medium" : "bg-[#f6f6f4] text-muted"}`}
                        >
                            {t === "sencillo" ? "Sencillo" : "Redondo"}
                        </button>
                    ))}
                </div>

                {/* Flight Info */}
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-5">
                    <h2 className="text-[11px] font-semibold text-text">
                        {flightType === "sencillo" ? "Vuelo de ida" : "Vuelos de ida y regreso"}
                    </h2>
                    {flightType === "redondo" && <h3 className="text-xs font-semibold text-text">Vuelo de ida</h3>}

                    <div className="flex gap-8">
                        <div className="flex-1">
                            <SelectGroup label="Origen" error={errors.originId?.message} {...register("originId")}>
                                <option value="">Seleccionar aeropuerto</option>
                                {airports.map((a) => <option key={a.id} value={a.id}>{airportLabel(a)}</option>)}
                            </SelectGroup>
                        </div>
                        <div className="flex-1">
                            <SelectGroup label="Destino" error={errors.destinationId?.message} {...register("destinationId")}>
                                <option value="">Seleccionar aeropuerto</option>
                                {airports.map((a) => <option key={a.id} value={a.id}>{airportLabel(a)}</option>)}
                            </SelectGroup>
                        </div>
                    </div>

                    <div className="w-full h-px bg-[#F0F0F0]" />

                    <div className="flex gap-8">
                        <div className="flex-1">
                            <InputGroup label="FBO de origen" type="text" placeholder="Dirección del FBO" {...register("fboOrigin")} />
                        </div>
                        <div className="flex-1">
                            <InputGroup label="FBO de destino (opcional)" type="text" placeholder="Dirección del FBO" {...register("fboDestination")} />
                        </div>
                    </div>

                    <div className="w-full h-px bg-[#F0F0F0]" />

                    <div className="flex gap-8">
                        <div className="flex-1">
                            <InputGroup label="Fecha de salida" type="date" error={errors.departureDate?.message} {...register("departureDate")} />
                        </div>
                        <div className="flex-1">
                            <InputGroup label="Hora de salida" type="time" error={errors.departureTime?.message} {...register("departureTime")} />
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <div className="flex-1">
                            <InputGroup label="Fecha de llegada" type="date" error={errors.arrivalDate?.message} {...register("arrivalDate")} />
                        </div>
                        <div className="flex-1">
                            <InputGroup label="Hora de llegada" type="time" error={errors.arrivalTime?.message} {...register("arrivalTime")} />
                        </div>
                    </div>

                    {flightType === "redondo" && (
                        <>
                            <div className="w-full h-px bg-border" />
                            <h3 className="text-xs font-semibold text-text">Vuelo de regreso</h3>
                            {originId && destinationId && (
                                <p className="text-[11px] text-muted -mt-2">
                                    {airportLabel(airports.find((a) => a.id === destinationId)!)} →{" "}
                                    {airportLabel(airports.find((a) => a.id === originId)!)}
                                </p>
                            )}
                            <div className="flex gap-8">
                                <div className="flex-1">
                                    <InputGroup label="Fecha de salida" type="date" error={errors.returnDate?.message} {...register("returnDate")} />
                                </div>
                                <div className="flex-1">
                                    <InputGroup label="Hora de salida" type="time" error={errors.returnTime?.message} {...register("returnTime")} />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Aircraft */}
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-3">
                    <h2 className="text-[11px] font-semibold text-text">Aeronave asignada</h2>
                    <SelectGroup label="" error={errors.aircraftId?.message} disabled={loadingAircraft} {...register("aircraftId")}>
                        <option value="">{loadingAircraft ? "Cargando aeronaves disponibles..." : "Seleccionar aeronave"}</option>
                        {availableAircraft.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.manufacturer ? `${a.manufacturer} ${a.model}` : a.model} ({a.tail_number}) · {a.seats} asientos
                            </option>
                        ))}
                    </SelectGroup>
                </div>

                {/* Crew */}
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                    <h2 className="text-[11px] font-semibold text-text">Tripulación asignada</h2>

                    <SelectGroup label="Capitán / Piloto" error={errors.captainId?.message} {...register("captainId")}>
                        <option value="">Seleccionar capitán</option>
                        {captains.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.first_name} {c.last_name}{c.license_number ? ` · ${c.license_number}` : ""}
                            </option>
                        ))}
                    </SelectGroup>

                    <div className="w-full h-px bg-[#F0F0F0]" />

                    <div>
                        <h3 className="text-xs font-medium text-text mb-1">Tripulación adicional (opcional)</h3>
                        <p className="text-[11px] text-muted mb-3">Copiloto, mecánico, asistente u otro miembro de tripulación</p>

                        {fields.length > 0 && (
                            <div className="flex flex-col gap-3 mb-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#FAFAFA] border border-border">
                                        <SelectGroup label="" className="flex-1" {...register(`additionalCrew.${index}.id`)}>
                                            <option value="">Seleccionar tripulante</option>
                                            {otherCrew
                                                .filter((c) => c.id !== captainId && (!usedCrewIds.has(c.id) || c.id === fields[index].id))
                                                .map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.first_name} {c.last_name}
                                                        {c.crew_role?.code === "FIRST_OFFICER" ? " · Copiloto" : ""}
                                                        {c.crew_role?.code === "FLIGHT_ATTENDANT" ? " · TCP" : ""}
                                                    </option>
                                                ))}
                                        </SelectGroup>
                                        <Button type="button" onClick={() => remove(index)} variant="outline" className="w-9 h-9 p-0 shrink-0" aria-label="Eliminar tripulante">
                                            <Trash2 className="w-4 h-4 text-muted" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button type="button" onClick={() => append({ id: "" })} variant="outline" className="w-full h-10 flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            Agregar tripulante
                        </Button>
                    </div>
                </div>

                {/* Commercial + Flight Plan */}
                <div className="flex gap-7">
                    <div className="flex-1 bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                        <h2 className="text-[11px] font-semibold text-text">Configuración comercial</h2>
                        <h3 className="text-xs font-medium text-text">Opciones de venta</h3>

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <Controller
                                    control={control}
                                    name="seatsForSale"
                                    render={({ field }) => (
                                        <NumericCounter
                                            label="Asientos para venta"
                                            value={field.value}
                                            onChange={field.onChange}
                                            min={1}
                                            max={selectedAircraft?.seats ?? 20}
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex-1 flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-text">Precio por asiento</label>
                                <div className={`flex items-center h-10 px-3 rounded-lg border ${errors.pricePerSeat ? "border-error" : "border-border"}`}>
                                    <span className="text-sm text-muted">$</span>
                                    <input type="number" placeholder="0.00" className="flex-1 bg-transparent text-sm outline-none ml-2" {...register("pricePerSeat")} />
                                    <span className="text-sm text-muted">MXN</span>
                                </div>
                                {errors.pricePerSeat && <span className="text-xs text-error">{errors.pricePerSeat.message}</span>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-text">Precio por avión completo</label>
                            <div className="h-10 px-3 rounded-lg border border-border flex items-center gap-2 bg-[#FAFAFA]">
                                <span className="text-sm text-muted">$</span>
                                <span className="text-sm text-text">
                                    {fullPrice > 0 ? fullPrice.toLocaleString("es-MX", { style: "currency", currency: "MXN" }) : "—"}
                                </span>
                            </div>
                            {selectedAircraft && (
                                <p className="text-[11px] text-muted">
                                    Calculado con {selectedAircraft.seats} asientos del{" "}
                                    {selectedAircraft.manufacturer ? `${selectedAircraft.manufacturer} ${selectedAircraft.model}` : selectedAircraft.model}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                        <h2 className="text-[11px] font-semibold text-text">Plan de vuelo</h2>
                        <p className="text-[11px] text-muted">Carga el PDF con el plan de vuelo detallado</p>
                        <DocumentUpload
                            accept=".pdf"
                            document={flightPlan ? { name: flightPlan.name, size: formatFileSize(flightPlan.size) } : undefined}
                            onUpload={setFlightPlan}
                            onRemove={() => setFlightPlan(null)}
                            pendingTitle="Plan de vuelo"
                            pendingDescription="Máximo 10 MB"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4 pt-8">
                    <Button type="button" onClick={() => onSubmit(true)} variant="primary" className="w-60 h-10" disabled={isPending}>
                        {isPending ? "Publicando..." : "Publicar vuelo"}
                    </Button>
                    <Button type="button" onClick={() => onSubmit(false)} variant="outline" className="w-60 h-10" disabled={isPending}>
                        {isPending ? "Guardando..." : "Guardar borrador"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
