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
import { AlertBox } from "@/components/molecules/AlertBox";
import { toast } from "@/components/atoms/Toast";
import { createClient } from "@/lib/supabase/client";
import { updateFlight } from "@/app/actions/flights";
import { getAvailableAircraftForTimeSlot } from "@/app/actions/aircraft";
import { getAvailableCrewForTimeSlot } from "@/app/actions/crew";
import type { OwnerFlightDetail } from "@/app/actions/flights";
import type { Airport } from "@/types/app.types";
import type { AircraftListItem } from "@/app/actions/aircraft";
import type { CrewListItem } from "@/app/actions/crew";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    flightId: string;
    ownerId:  string;
    initial:  OwnerFlightDetail;
    airports: Airport[];
    aircraft: AircraftListItem[];
    crew:     CrewListItem[];
}

type FlightType = "sencillo" | "redondo";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    originId:       z.string().min(1, "Selecciona el aeropuerto de origen"),
    destinationId:  z.string().min(1, "Selecciona el aeropuerto de destino"),
    fboOrigin:      z.string().min(1, "FBO de origen requerido"),
    fboDestination: z.string().optional(),
    departureDate:  z.string().min(1, "Fecha requerida"),
    departureTime:  z.string().min(1, "Hora requerida"),
    arrivalDate:    z.string().min(1, "Fecha requerida"),
    arrivalTime:    z.string().min(1, "Hora requerida"),
    returnDate:           z.string().optional(),
    returnTime:           z.string().optional(),
    returnArrivalDate:    z.string().optional(),
    returnArrivalTime:    z.string().optional(),
    returnFboOrigin:      z.string().optional(),
    returnFboDestination: z.string().optional(),
    aircraftId:     z.string().min(1, "Selecciona una aeronave"),
    captainId:      z.string().min(1, "Selecciona un capitán"),
    additionalCrew: z.array(z.object({ id: z.string() })).optional(),
    seatsForSale:        z.number().min(1),
    pricePerSeat:        z.string().refine((v) => { const n = parseFloat(v.replace(/,/g, "")); return !isNaN(n) && n > 0; }, "Precio inválido"),
    priceFullAircraft:   z.string().refine((v) => { const n = parseFloat(v.replace(/,/g, "")); return !isNaN(n) && n > 0; }, "Precio inválido"),
}).refine(
    (d) => !d.originId || !d.destinationId || d.originId !== d.destinationId,
    { message: "El destino debe ser diferente al origen", path: ["destinationId"] },
).refine(
    (d) => {
        if (!d.departureDate || !d.departureTime || !d.arrivalDate || !d.arrivalTime) return true;
        return `${d.arrivalDate}T${d.arrivalTime}` > `${d.departureDate}T${d.departureTime}`;
    },
    { message: "La llegada debe ser posterior a la salida", path: ["arrivalDate"] },
).refine(
    (d) => {
        if (!d.departureDate || !d.departureTime) return true;
        const dep    = new Date(`${d.departureDate}T${d.departureTime}`);
        const minDep = new Date(Date.now() + 24 * 60 * 60 * 1000);
        return dep >= minDep;
    },
    { message: "La salida debe programarse con al menos 24 hrs de anticipación", path: ["departureDate"] },
).refine(
    (d) => {
        if (!d.returnDate || !d.returnTime || !d.arrivalDate || !d.arrivalTime) return true;
        return `${d.returnDate}T${d.returnTime}` > `${d.arrivalDate}T${d.arrivalTime}`;
    },
    { message: "La salida de regreso debe ser posterior a la llegada del vuelo de ida", path: ["returnDate"] },
).refine(
    (d) => {
        if (!d.returnDate || !d.returnTime || !d.returnArrivalDate || !d.returnArrivalTime) return true;
        return `${d.returnArrivalDate}T${d.returnArrivalTime}` > `${d.returnDate}T${d.returnTime}`;
    },
    { message: "La llegada de regreso debe ser posterior a la salida de regreso", path: ["returnArrivalDate"] },
);

type FormData = z.infer<typeof schema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISO(date: string, time: string): string {
    return new Date(`${date}T${time}:00`).toISOString();
}

function isoDate(iso: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isoTime(iso: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function airportLabel(a: Airport): string {
    return `${a.city} (${a.iata_code})`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditFlightContent({ flightId, ownerId, initial, airports, aircraft, crew }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [flightType, setFlightType] = useState<FlightType>(
        initial.flight_type === "ROUND_TRIP" ? "redondo" : "sencillo",
    );
    const [flightPlan, setFlightPlan] = useState<File | null>(null);
    const [existingPlanUrl, setExistingPlanUrl] = useState<string | null>(initial.flight_plan_url);
    const [flightPlanError, setFlightPlanError] = useState(false);
    const showFlightPlan = ["PENDING_REVIEW", "REJECTED"].includes(initial.status_code);
    const [filteredAircraft, setFilteredAircraft] = useState<AircraftListItem[]>(aircraft);
    const [filteredCrew, setFilteredCrew] = useState<CrewListItem[]>(crew);
    const [loadingAircraft, setLoadingAircraft] = useState(false);

    // Derive initial airport IDs
    const depAirport = airports.find((a) => a.iata_code === initial.departure_airport.iata_code);
    const arrAirport = airports.find((a) => a.iata_code === initial.arrival_airport.iata_code);

    // Derive captain and additional crew from initial.crew
    const initialCaptain    = initial.crew.find((c) => c.role_code === "CAPTAIN");
    const initialAdditional = initial.crew
        .filter((c) => c.role_code !== "CAPTAIN")
        .map((c) => ({ id: c.id }));

    const soldSeats     = initial.total_seats - initial.available_seats;
    const hasPassengers = soldSeats > 0;
    // Un vuelo retrasado puede reprogramar fecha/hora aunque ya tenga pasajeros
    const dateTimeDisabled = hasPassengers && initial.status_code !== "DELAYED";
    const requiredSeats = initial.aircraft?.seats ?? null;

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        getValues,
        setError,
        clearErrors,
        trigger,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            originId:       depAirport?.id ?? "",
            destinationId:  arrAirport?.id ?? "",
            fboOrigin:      initial.departure_fbo_name ?? "",
            fboDestination: initial.arrival_fbo_name   ?? "",
            departureDate:  isoDate(initial.departure_datetime),
            departureTime:  isoTime(initial.departure_datetime),
            arrivalDate:    isoDate(initial.arrival_datetime),
            arrivalTime:    isoTime(initial.arrival_datetime),
            returnDate:           initial.return_departure_datetime ? isoDate(initial.return_departure_datetime) : "",
            returnTime:           initial.return_departure_datetime ? isoTime(initial.return_departure_datetime) : "",
            returnArrivalDate:    initial.return_arrival_datetime   ? isoDate(initial.return_arrival_datetime)   : "",
            returnArrivalTime:    initial.return_arrival_datetime   ? isoTime(initial.return_arrival_datetime)   : "",
            returnFboOrigin:      initial.return_departure_fbo_name ?? "",
            returnFboDestination: initial.return_arrival_fbo_name   ?? "",
            aircraftId:     initial.aircraft?.id ?? "",
            captainId:      initialCaptain?.id ?? "",
            additionalCrew: initialAdditional,
            seatsForSale:   initial.total_seats,
            pricePerSeat:        String(initial.price_per_seat),
            priceFullAircraft:   String(initial.price_full_aircraft),
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "additionalCrew" });

    const [
        departureDate, departureTime, arrivalDate, arrivalTime,
        aircraftId, captainId, additionalCrew, seatsForSale, pricePerSeat,
        originId, destinationId,
        returnDate, returnTime, returnArrivalDate, returnArrivalTime,
    ] = watch([
        "departureDate", "departureTime", "arrivalDate", "arrivalTime",
        "aircraftId", "captainId", "additionalCrew", "seatsForSale", "pricePerSeat",
        "originId", "destinationId",
        "returnDate", "returnTime", "returnArrivalDate", "returnArrivalTime",
    ]);

    // Real-time cross-field validation for return flight dates
    useEffect(() => {
        if (flightType !== "redondo" || !returnDate || !returnTime) return;
        if (!arrivalDate || !arrivalTime) return;
        if (`${returnDate}T${returnTime}` <= `${arrivalDate}T${arrivalTime}`) {
            setError("returnDate", { message: "La salida de regreso debe ser posterior a la llegada del vuelo de ida" });
        } else {
            clearErrors("returnDate");
        }
    }, [arrivalDate, arrivalTime, returnDate, returnTime, flightType]);

    useEffect(() => {
        if (flightType !== "redondo" || !returnArrivalDate || !returnArrivalTime) return;
        if (!returnDate || !returnTime) return;
        if (`${returnArrivalDate}T${returnArrivalTime}` <= `${returnDate}T${returnTime}`) {
            setError("returnArrivalDate", { message: "La llegada de regreso debe ser posterior a la salida de regreso" });
        } else {
            clearErrors("returnArrivalDate");
        }
    }, [returnDate, returnTime, returnArrivalDate, returnArrivalTime, flightType]);

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
                getAvailableAircraftForTimeSlot(ownerId, departure, arrival, flightId),
                getAvailableCrewForTimeSlot(ownerId, departure, arrival, flightId),
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
        if (hasPassengers) return;
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

    useEffect(() => {
        if (hasPassengers) return;
        if (!(departureDate && departureTime)) return;
        const dep    = new Date(`${departureDate}T${departureTime}`);
        const minDep = new Date(Date.now() + 24 * 60 * 60 * 1000);
        if (dep < minDep) {
            setError("departureDate", { type: "manual", message: "La salida debe programarse con al menos 24 hrs de anticipación" });
        } else {
            clearErrors("departureDate");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departureDate, departureTime]);

    // ── Auto-calculate full aircraft price ────────────────────────────────────
    useEffect(() => {
        if (hasPassengers) return;
        const num   = parseFloat((pricePerSeat || "0").replace(/,/g, ""));
        const seats = seatsForSale || 0;
        const full  = num > 0 && seats > 0 ? String(num * seats) : "";
        setValue("priceFullAircraft", full, { shouldValidate: !!full });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pricePerSeat, seatsForSale]);

    const selectedAircraft     = aircraft.find((a) => a.id === aircraftId);
    const seatFilteredAircraft = requiredSeats != null
        ? availableAircraft.filter((a) => a.seats >= requiredSeats)
        : availableAircraft;

    const captains    = availableCrew.filter((c) => c.crew_role?.code === "CAPTAIN");
    const otherCrew   = availableCrew;
    const usedCrewIds = new Set([captainId, ...(additionalCrew ?? []).map((c) => c.id)].filter(Boolean));

    const uploadFlightPlan = async (userId: string): Promise<string | null> => {
        if (!flightPlan) return existingPlanUrl;
        const supabase = createClient();
        if (!supabase) return existingPlanUrl;
        const ext  = flightPlan.name.split(".").pop();
        const path = `${userId}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("flight-plans").upload(path, flightPlan);
        if (error) { console.error("[uploadFlightPlan]", error.message); return existingPlanUrl; }
        const { data } = await supabase.storage.from("flight-plans").createSignedUrl(path, 60 * 60 * 24 * 365);
        return data?.signedUrl ?? existingPlanUrl;
    };

    const onSubmit = (isVisible: boolean) => {
        if (hasPassengers) {
            const currentAircraftId     = getValues("aircraftId");
            const currentCaptainId      = getValues("captainId");
            const currentAdditionalCrew = getValues("additionalCrew");
            const currentSeatsForSale   = getValues("seatsForSale");

            if (!currentAircraftId) {
                setError("aircraftId", { message: "Selecciona una aeronave" });
                return;
            }
            if (!currentCaptainId) {
                setError("captainId", { message: "Selecciona un capitán" });
                return;
            }

            startTransition(async () => {
                const allCrew = [currentCaptainId, ...(currentAdditionalCrew ?? []).map((c) => c.id).filter(Boolean)];

                const { error } = await updateFlight(flightId, ownerId, {
                    flightType:              initial.flight_type as "ONE_WAY" | "ROUND_TRIP",
                    departureAirportId:      depAirport?.id ?? "",
                    arrivalAirportId:        arrAirport?.id ?? "",
                    departureFboName:        initial.departure_fbo_name ?? "",
                    arrivalFboName:          initial.arrival_fbo_name   ?? "",
                    departureDatetime:       initial.departure_datetime,
                    arrivalDatetime:         initial.arrival_datetime,
                    returnDepartureDatetime: initial.return_departure_datetime ?? null,
                    returnArrivalDatetime:   initial.return_arrival_datetime   ?? null,
                    returnDepartureFboName:  initial.return_departure_fbo_name ?? null,
                    returnArrivalFboName:    initial.return_arrival_fbo_name   ?? null,
                    aircraftId:              currentAircraftId,
                    totalSeats:              currentSeatsForSale,
                    pricePerSeat:            initial.price_per_seat,
                    priceFullAircraft:       initial.price_full_aircraft,
                    flightPlanUrl:           existingPlanUrl,
                    isVisible,
                    crewMemberIds:           allCrew,
                });

                if (error) {
                    toast.error("Error al actualizar el vuelo", error);
                } else {
                    toast.success(
                        isVisible ? "Vuelo actualizado" : "Borrador guardado",
                        isVisible ? "Los cambios ya son visibles" : "Puedes publicarlo desde el detalle del vuelo",
                    );
                    router.push(`/owner/vuelos/${flightId}`);
                }
            });
            return;
        }

        handleSubmit(async (data) => {
            if (showFlightPlan && !flightPlan && !existingPlanUrl) { setFlightPlanError(true); return; }
            setFlightPlanError(false);
            startTransition(async () => {
                const supabase = createClient();
                const { data: { user } } = await supabase!.auth.getUser();
                const uid = user?.id ?? ownerId;

                const flightPlanUrl = await uploadFlightPlan(uid);
                const allCrew = [data.captainId, ...(data.additionalCrew ?? []).map((c) => c.id).filter(Boolean)];

                const { error } = await updateFlight(flightId, ownerId, {
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
                    returnArrivalDatetime:   flightType === "redondo" && data.returnArrivalDate && data.returnArrivalTime
                        ? toISO(data.returnArrivalDate, data.returnArrivalTime)
                        : null,
                    returnDepartureFboName:  flightType === "redondo" ? (data.returnFboOrigin ?? null) : null,
                    returnArrivalFboName:    flightType === "redondo" ? (data.returnFboDestination ?? null) : null,
                    aircraftId:              data.aircraftId,
                    totalSeats:              data.seatsForSale,
                    pricePerSeat:            parseFloat(data.pricePerSeat.replace(/,/g, "")),
                    priceFullAircraft:       parseFloat(data.priceFullAircraft.replace(/,/g, "")),
                    flightPlanUrl,
                    isVisible,
                    crewMemberIds:           allCrew,
                });

                if (error) {
                    toast.error("Error al actualizar el vuelo", error);
                } else {
                    toast.success(
                        isVisible ? "Vuelo actualizado" : "Borrador guardado",
                        isVisible ? "Los cambios ya son visibles" : "Puedes publicarlo desde el detalle del vuelo",
                    );
                    router.push(`/owner/vuelos/${flightId}`);
                }
            });
        })();
    };

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <Button
                    onClick={() => router.push(`/owner/vuelos/${flightId}`)}
                    variant="link"
                    className="flex items-center gap-3 mb-5 p-0 text-xs font-medium text-muted hover:text-text"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al vuelo
                </Button>
                <div className="flex flex-col gap-2">
                    <h1 className="text-[26px] font-semibold text-text">Editar vuelo</h1>
                    <p className="text-sm text-muted">Modifica la configuración de tu vuelo</p>
                </div>
            </div>

            {hasPassengers && (
                <div className="px-12 pb-4">
                    <AlertBox
                        variant="warning"
                        title="Edición limitada"
                        description={`Este vuelo ya tiene ${soldSeats} asiento${soldSeats !== 1 ? "s" : ""} vendido${soldSeats !== 1 ? "s" : ""}. Solo puedes cambiar la aeronave (igual o mayor capacidad), los asientos para venta y la tripulación.`}
                    />
                </div>
            )}

            <div className="px-12 pb-8 flex flex-col gap-7">
                {/* Type Toggle */}
                <div className="flex">
                    {(["sencillo", "redondo"] as FlightType[]).map((t, i) => (
                        <Button
                            key={t}
                            type="button"
                            variant="ghost"
                            disabled={hasPassengers}
                            onClick={() => setFlightType(t)}
                            className={`flex-1 h-11 border border-border transition-colors ${
                                i === 0 ? "rounded-l-xl" : "rounded-r-xl border-l-0"
                            } ${flightType === t ? "bg-white text-text font-medium" : "bg-[#f6f6f4] text-muted"}`}
                        >
                            {t === "sencillo" ? "Sencillo" : "Redondo"}
                        </Button>
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
                            <SelectGroup label="Origen" error={errors.originId?.message} disabled={hasPassengers} {...register("originId")}>
                                <option value="">Seleccionar aeropuerto</option>
                                {airports.map((a) => <option key={a.id} value={a.id}>{airportLabel(a)}</option>)}
                            </SelectGroup>
                        </div>
                        <div className="flex-1">
                            <SelectGroup label="Destino" error={errors.destinationId?.message} disabled={hasPassengers} {...register("destinationId")}>
                                <option value="">Seleccionar aeropuerto</option>
                                {airports.map((a) => <option key={a.id} value={a.id}>{airportLabel(a)}</option>)}
                            </SelectGroup>
                        </div>
                    </div>

                    <div className="w-full h-px bg-[#F0F0F0]" />

                    <div className="flex gap-8">
                        <div className="flex-1">
                            <InputGroup label="FBO de origen" type="text" placeholder="Dirección del FBO" error={errors.fboOrigin?.message} disabled={hasPassengers} {...register("fboOrigin")} />
                        </div>
                        <div className="flex-1">
                            <InputGroup label="FBO de destino (opcional)" type="text" placeholder="Dirección del FBO" disabled={hasPassengers} {...register("fboDestination")} />
                        </div>
                    </div>

                    <div className="w-full h-px bg-[#F0F0F0]" />

                    <div className="flex gap-8">
                        <div className="flex-1">
                            <InputGroup label="Fecha de salida" type="date" error={errors.departureDate?.message} disabled={dateTimeDisabled} {...register("departureDate")} />
                        </div>
                        <div className="flex-1">
                            <InputGroup label="Hora de salida" type="time" error={errors.departureTime?.message} disabled={dateTimeDisabled} {...register("departureTime")} />
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <div className="flex-1">
                            <InputGroup label="Fecha de llegada" type="date" error={errors.arrivalDate?.message} disabled={dateTimeDisabled} {...register("arrivalDate")} />
                        </div>
                        <div className="flex-1">
                            <InputGroup label="Hora de llegada" type="time" error={errors.arrivalTime?.message} disabled={dateTimeDisabled} {...register("arrivalTime")} />
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
                                    <InputGroup label="FBO de origen" placeholder="Dirección del FBO" error={errors.returnFboOrigin?.message} disabled={hasPassengers} {...register("returnFboOrigin")} />
                                </div>
                                <div className="flex-1">
                                    <InputGroup label="FBO de destino (opcional)" placeholder="Dirección del FBO" disabled={hasPassengers} {...register("returnFboDestination")} />
                                </div>
                            </div>
                            <div className="flex gap-8">
                                <div className="flex-1">
                                    <InputGroup label="Fecha de salida" type="date" error={errors.returnDate?.message} disabled={dateTimeDisabled} {...register("returnDate")} />
                                </div>
                                <div className="flex-1">
                                    <InputGroup label="Hora de salida" type="time" error={errors.returnTime?.message} disabled={dateTimeDisabled} {...register("returnTime")} />
                                </div>
                            </div>
                            <div className="flex gap-8">
                                <div className="flex-1">
                                    <InputGroup label="Fecha de llegada" type="date" error={errors.returnArrivalDate?.message} disabled={dateTimeDisabled} {...register("returnArrivalDate")} />
                                </div>
                                <div className="flex-1">
                                    <InputGroup label="Hora de llegada" type="time" error={errors.returnArrivalTime?.message} disabled={dateTimeDisabled} {...register("returnArrivalTime")} />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Aircraft */}
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-3">
                    <h2 className="text-[11px] font-semibold text-text">Aeronave asignada</h2>
                    {requiredSeats != null && (
                        <p className="text-[11px] text-muted -mt-1">
                            Solo se muestran aeronaves con {requiredSeats} asientos o más (igual o mayor capacidad que la aeronave original)
                        </p>
                    )}
                    <SelectGroup label="" error={errors.aircraftId?.message} disabled={loadingAircraft} {...register("aircraftId")}>
                        <option value="">{loadingAircraft ? "Cargando aeronaves disponibles..." : "Seleccionar aeronave"}</option>
                        {seatFilteredAircraft.map((a) => (
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
                                                .filter((c) => c.id !== captainId && (!usedCrewIds.has(c.id) || c.id === (additionalCrew ?? [])[index]?.id))
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
                                            min={hasPassengers ? soldSeats : 1}
                                            max={selectedAircraft?.seats ?? 20}
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex-1">
                                <Controller
                                    name="pricePerSeat"
                                    control={control}
                                    render={({ field }) => (
                                        <InputGroup
                                            label="Precio por asiento"
                                            prefix="$"
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="0"
                                            error={errors.pricePerSeat?.message}
                                            disabled={hasPassengers}
                                            value={field.value
                                                ? Number(field.value.replace(/,/g, "")).toLocaleString("es-MX")
                                                : ""}
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/[^0-9.]/g, "");
                                                field.onChange(raw);
                                            }}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div>
                            <Controller
                                name="priceFullAircraft"
                                control={control}
                                render={({ field }) => (
                                    <InputGroup
                                        label="Precio por avión completo"
                                        prefix="$"
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="0"
                                        error={errors.priceFullAircraft?.message}
                                        disabled={hasPassengers}
                                        helperText={selectedAircraft && !hasPassengers
                                            ? `Auto-calculado · puedes editarlo para ofrecer un descuento`
                                            : undefined}
                                        value={field.value
                                            ? Number(field.value.replace(/,/g, "")).toLocaleString("es-MX")
                                            : ""}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/[^0-9.]/g, "");
                                            field.onChange(raw);
                                        }}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {showFlightPlan && <div className="flex-1 bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                        <h2 className="text-[11px] font-semibold text-text">Plan de vuelo</h2>
                        <p className="text-[11px] text-muted">Carga el PDF con el plan de vuelo detallado</p>
                        {existingPlanUrl && !flightPlan && (
                            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#FAFAFA] border border-border">
                                <span className="text-[12px] text-text truncate">Plan de vuelo actual</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setExistingPlanUrl(null)}
                                    className="text-[11px] text-muted hover:text-text ml-2 shrink-0 h-auto p-0"
                                >
                                    Eliminar
                                </Button>
                            </div>
                        )}
                        {(!existingPlanUrl || flightPlan) && (
                            <DocumentUpload
                                accept=".pdf"
                                document={flightPlan ? { name: flightPlan.name, size: formatFileSize(flightPlan.size) } : undefined}
                                onUpload={(file) => {
                                    if (file.size > 10 * 1024 * 1024) {
                                        toast.error("Archivo demasiado grande", "El plan de vuelo no puede superar los 10 MB.");
                                        return;
                                    }
                                    setFlightPlan(file);
                                    setExistingPlanUrl(null);
                                    setFlightPlanError(false);
                                }}
                                onRemove={() => setFlightPlan(null)}
                                pendingTitle="Plan de vuelo"
                                pendingDescription="Máximo 10 MB"
                                error={flightPlanError}
                            />
                        )}
                    </div>}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4 pt-8">
                    <Button type="button" onClick={() => onSubmit(true)} variant="primary" className="w-60 h-10" disabled={isPending}>
                        {isPending ? "Actualizando..." : "Actualizar vuelo"}
                    </Button>
                    <Button type="button" onClick={() => router.push(`/owner/vuelos/${flightId}`)} variant="outline" className="w-60 h-10" disabled={isPending}>
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
}
