"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InputGroup } from "@/components/molecules/InputGroup";
import { SelectGroup } from "@/components/molecules/SelectGroup";
import { NumericCounter } from "@/components/molecules/NumericCounter";
import { DocumentUpload, formatFileSize } from "@/components/molecules/DocumentUpload";
import { toast } from "@/components/atoms/Toast";
import { createClient } from "@/lib/supabase/client";
import { updateFlight } from "@/app/actions/flights";
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

interface FormState {
    originId:        string;
    destinationId:   string;
    fboOrigin:       string;
    fboDestination:  string;
    departureDate:   string;
    departureTime:   string;
    arrivalDate:     string;
    arrivalTime:     string;
    returnDate:      string;
    returnTime:      string;
    aircraftId:      string;
    captainId:       string;
    additionalCrew:  string[];
    seatsForSale:    number;
    pricePerSeat:    string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISO(date: string, time: string): string {
    return `${date}T${time}:00`;
}

function isoDate(iso: string): string {
    return iso ? iso.slice(0, 10) : "";
}

function isoTime(iso: string): string {
    return iso ? iso.slice(11, 16) : "";
}

function airportLabel(a: Airport): string {
    return `${a.city} (${a.iata_code})`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditFlightContent({ flightId, ownerId, initial, airports, aircraft, crew }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Derive initial airport IDs by matching iata_code
    const depAirport = airports.find((a) => a.iata_code === initial.departure_airport.iata_code);
    const arrAirport = airports.find((a) => a.iata_code === initial.arrival_airport.iata_code);

    // Derive captain and additional crew from initial.crew
    const initialCaptain = initial.crew.find((c) => c.role_code === "CAPTAIN");
    const initialAdditional = initial.crew
        .filter((c) => c.role_code !== "CAPTAIN")
        .map((c) => c.id);

    const [flightType, setFlightType] = useState<FlightType>(
        initial.flight_type === "ROUND_TRIP" ? "redondo" : "sencillo",
    );
    const [flightPlan, setFlightPlan] = useState<File | null>(null);
    // Keep track of existing URL; cleared if a new file is uploaded
    const [existingPlanUrl, setExistingPlanUrl] = useState<string | null>(initial.flight_plan_url);

    const [form, setForm] = useState<FormState>({
        originId:       depAirport?.id ?? "",
        destinationId:  arrAirport?.id ?? "",
        fboOrigin:      initial.departure_fbo_name ?? "",
        fboDestination: initial.arrival_fbo_name   ?? "",
        departureDate:  isoDate(initial.departure_datetime),
        departureTime:  isoTime(initial.departure_datetime),
        arrivalDate:    isoDate(initial.arrival_datetime),
        arrivalTime:    isoTime(initial.arrival_datetime),
        returnDate:     initial.return_departure_datetime ? isoDate(initial.return_departure_datetime) : "",
        returnTime:     initial.return_departure_datetime ? isoTime(initial.return_departure_datetime) : "",
        aircraftId:     initial.aircraft?.id ?? "",
        captainId:      initialCaptain?.id ?? "",
        additionalCrew: initialAdditional,
        seatsForSale:   initial.total_seats,
        pricePerSeat:   String(initial.price_per_seat),
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormState | "general", string>>>({});

    const set = (key: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const selectedAircraft = aircraft.find((a) => a.id === form.aircraftId);
    const priceNum          = parseFloat(form.pricePerSeat) || 0;
    const fullPrice         = priceNum * (selectedAircraft?.seats ?? form.seatsForSale);

    const captains    = crew.filter((c) => c.crew_role?.code === "CAPTAIN" && c.status.toUpperCase() === "ACTIVE");
    const otherCrew   = crew.filter((c) => c.status.toUpperCase() === "ACTIVE");
    const usedCrewIds = new Set([form.captainId, ...form.additionalCrew].filter(Boolean));

    const validate = () => {
        const e: typeof errors = {};
        if (!form.originId)       e.originId       = "Selecciona el aeropuerto de origen";
        if (!form.destinationId)  e.destinationId  = "Selecciona el aeropuerto de destino";
        if (form.originId && form.originId === form.destinationId)
            e.destinationId = "El destino debe ser diferente al origen";
        if (!form.departureDate)  e.departureDate  = "Fecha requerida";
        if (!form.departureTime)  e.departureTime  = "Hora requerida";
        if (!form.arrivalDate)    e.arrivalDate    = "Fecha requerida";
        if (!form.arrivalTime)    e.arrivalTime    = "Hora requerida";
        if (flightType === "redondo") {
            if (!form.returnDate) e.returnDate = "Fecha requerida";
            if (!form.returnTime) e.returnTime = "Hora requerida";
        }
        if (!form.aircraftId)    e.aircraftId    = "Selecciona una aeronave";
        if (!form.captainId)     e.captainId     = "Selecciona un capitán";
        if (!form.pricePerSeat || isNaN(priceNum) || priceNum <= 0)
            e.pricePerSeat = "Precio inválido";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

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

    const handleSubmit = (isVisible: boolean) => {
        if (!validate()) return;

        startTransition(async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase!.auth.getUser();
            const uid = user?.id ?? ownerId;

            const flightPlanUrl = await uploadFlightPlan(uid);
            const allCrew = [form.captainId, ...form.additionalCrew.filter(Boolean)];

            const { error } = await updateFlight(flightId, ownerId, {
                flightType:              flightType === "redondo" ? "ROUND_TRIP" : "ONE_WAY",
                departureAirportId:      form.originId,
                arrivalAirportId:        form.destinationId,
                departureFboName:        form.fboOrigin,
                arrivalFboName:          form.fboDestination,
                departureDatetime:       toISO(form.departureDate, form.departureTime),
                arrivalDatetime:         toISO(form.arrivalDate, form.arrivalTime),
                returnDepartureDatetime: flightType === "redondo"
                    ? toISO(form.returnDate, form.returnTime)
                    : null,
                aircraftId:              form.aircraftId,
                totalSeats:              form.seatsForSale,
                pricePerSeat:            priceNum,
                priceFullAircraft:       fullPrice,
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

            <div className="px-12 pb-8 flex flex-col gap-7">
                {/* Type Toggle */}
                <div className="flex">
                    {(["sencillo", "redondo"] as FlightType[]).map((t, i) => (
                        <button
                            key={t}
                            onClick={() => setFlightType(t)}
                            className={`flex-1 h-11 border border-border transition-colors ${
                                i === 0 ? "rounded-l-xl" : "rounded-r-xl border-l-0"
                            } ${flightType === t ? "bg-white text-text font-medium" : "bg-[#f6f6f4] text-muted"}`}
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

                    {flightType === "redondo" && (
                        <h3 className="text-xs font-semibold text-text">Vuelo de ida</h3>
                    )}

                    {/* Airports */}
                    <div className="flex gap-8">
                        <div className="flex-1">
                            <SelectGroup
                                label="Origen"
                                value={form.originId}
                                onChange={set("originId")}
                                error={errors.originId}
                            >
                                <option value="">Seleccionar aeropuerto</option>
                                {airports.map((a) => (
                                    <option key={a.id} value={a.id}>{airportLabel(a)}</option>
                                ))}
                            </SelectGroup>
                        </div>
                        <div className="flex-1">
                            <SelectGroup
                                label="Destino"
                                value={form.destinationId}
                                onChange={set("destinationId")}
                                error={errors.destinationId}
                            >
                                <option value="">Seleccionar aeropuerto</option>
                                {airports.map((a) => (
                                    <option key={a.id} value={a.id}>{airportLabel(a)}</option>
                                ))}
                            </SelectGroup>
                        </div>
                    </div>

                    <div className="w-full h-px bg-[#F0F0F0]" />

                    {/* FBOs */}
                    <div className="flex gap-8">
                        <div className="flex-1">
                            <InputGroup
                                label="FBO de origen"
                                type="text"
                                value={form.fboOrigin}
                                onChange={set("fboOrigin")}
                                placeholder="Dirección del FBO"
                            />
                        </div>
                        <div className="flex-1">
                            <InputGroup
                                label="FBO de destino (opcional)"
                                type="text"
                                value={form.fboDestination}
                                onChange={set("fboDestination")}
                                placeholder="Dirección del FBO"
                            />
                        </div>
                    </div>

                    <div className="w-full h-px bg-[#F0F0F0]" />

                    {/* Departure */}
                    <div className="flex gap-8">
                        <div className="flex-1">
                            <InputGroup
                                label="Fecha de salida"
                                type="date"
                                value={form.departureDate}
                                onChange={set("departureDate")}
                                error={errors.departureDate}
                            />
                        </div>
                        <div className="flex-1">
                            <InputGroup
                                label="Hora de salida"
                                type="time"
                                value={form.departureTime}
                                onChange={set("departureTime")}
                                error={errors.departureTime}
                            />
                        </div>
                    </div>

                    {/* Arrival */}
                    <div className="flex gap-8">
                        <div className="flex-1">
                            <InputGroup
                                label="Fecha de llegada"
                                type="date"
                                value={form.arrivalDate}
                                onChange={set("arrivalDate")}
                                error={errors.arrivalDate}
                            />
                        </div>
                        <div className="flex-1">
                            <InputGroup
                                label="Hora de llegada"
                                type="time"
                                value={form.arrivalTime}
                                onChange={set("arrivalTime")}
                                error={errors.arrivalTime}
                            />
                        </div>
                    </div>

                    {/* Return section */}
                    {flightType === "redondo" && (
                        <>
                            <div className="w-full h-px bg-border" />
                            <h3 className="text-xs font-semibold text-text">Vuelo de regreso</h3>

                            {form.originId && form.destinationId && (
                                <p className="text-[11px] text-muted -mt-2">
                                    {airportLabel(airports.find((a) => a.id === form.destinationId)!)} →{" "}
                                    {airportLabel(airports.find((a) => a.id === form.originId)!)}
                                </p>
                            )}

                            <div className="flex gap-8">
                                <div className="flex-1">
                                    <InputGroup
                                        label="Fecha de salida"
                                        type="date"
                                        value={form.returnDate}
                                        onChange={set("returnDate")}
                                        error={errors.returnDate}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputGroup
                                        label="Hora de salida"
                                        type="time"
                                        value={form.returnTime}
                                        onChange={set("returnTime")}
                                        error={errors.returnTime}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Aircraft */}
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-3">
                    <h2 className="text-[11px] font-semibold text-text">Aeronave asignada</h2>
                    <SelectGroup
                        label=""
                        value={form.aircraftId}
                        onChange={set("aircraftId")}
                        error={errors.aircraftId}
                    >
                        <option value="">Seleccionar aeronave</option>
                        {aircraft.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.manufacturer ? `${a.manufacturer} ${a.model}` : a.model} ({a.tail_number}) · {a.seats} asientos
                            </option>
                        ))}
                    </SelectGroup>
                </div>

                {/* Crew */}
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                    <h2 className="text-[11px] font-semibold text-text">Tripulación asignada</h2>

                    <SelectGroup
                        label="Capitán / Piloto"
                        value={form.captainId}
                        onChange={set("captainId")}
                        error={errors.captainId}
                    >
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
                        <p className="text-[11px] text-muted mb-3">
                            Copiloto, mecánico, asistente u otro miembro de tripulación
                        </p>

                        {form.additionalCrew.length > 0 && (
                            <div className="flex flex-col gap-3 mb-3">
                                {form.additionalCrew.map((crewId, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-[#FAFAFA] border border-border">
                                        <SelectGroup
                                            label=""
                                            value={crewId}
                                            onChange={(e) => {
                                                const next = [...form.additionalCrew];
                                                next[index] = e.target.value;
                                                setForm((prev) => ({ ...prev, additionalCrew: next }));
                                            }}
                                            className="flex-1"
                                        >
                                            <option value="">Seleccionar tripulante</option>
                                            {otherCrew
                                                .filter((c) => c.id !== form.captainId && (!usedCrewIds.has(c.id) || c.id === crewId))
                                                .map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.first_name} {c.last_name}
                                                        {c.crew_role?.code === "FIRST_OFFICER" ? " · Copiloto" : ""}
                                                        {c.crew_role?.code === "FLIGHT_ATTENDANT" ? " · TCP" : ""}
                                                    </option>
                                                ))}
                                        </SelectGroup>
                                        <Button
                                            onClick={() => setForm((prev) => ({
                                                ...prev,
                                                additionalCrew: prev.additionalCrew.filter((_, i) => i !== index),
                                            }))}
                                            variant="outline"
                                            className="w-9 h-9 p-0 shrink-0"
                                            aria-label="Eliminar tripulante"
                                        >
                                            <Trash2 className="w-4 h-4 text-muted" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button
                            onClick={() => setForm((prev) => ({ ...prev, additionalCrew: [...prev.additionalCrew, ""] }))}
                            variant="outline"
                            className="w-full h-10 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar tripulante
                        </Button>
                    </div>
                </div>

                {/* Commercial + Flight Plan */}
                <div className="flex gap-7">
                    {/* Commercial */}
                    <div className="flex-1 bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                        <h2 className="text-[11px] font-semibold text-text">Configuración comercial</h2>

                        <h3 className="text-xs font-medium text-text">Opciones de venta</h3>

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <NumericCounter
                                    label="Asientos para venta"
                                    value={form.seatsForSale}
                                    onChange={(v) => setForm((prev) => ({ ...prev, seatsForSale: v }))}
                                    min={1}
                                    max={selectedAircraft?.seats ?? 20}
                                />
                            </div>

                            <div className="flex-1 flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-text">Precio por asiento</label>
                                <div className={`flex items-center h-10 px-3 rounded-lg border ${errors.pricePerSeat ? "border-error" : "border-border"}`}>
                                    <span className="text-sm text-muted">$</span>
                                    <input
                                        type="number"
                                        value={form.pricePerSeat}
                                        onChange={set("pricePerSeat")}
                                        placeholder="0.00"
                                        className="flex-1 bg-transparent text-sm outline-none ml-2"
                                    />
                                    <span className="text-sm text-muted">MXN</span>
                                </div>
                                {errors.pricePerSeat && (
                                    <span className="text-xs text-error">{errors.pricePerSeat}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-text">Precio por avión completo</label>
                            <div className="h-10 px-3 rounded-lg border border-border flex items-center gap-2 bg-[#FAFAFA]">
                                <span className="text-sm text-muted">$</span>
                                <span className="text-sm text-text">
                                    {fullPrice > 0
                                        ? fullPrice.toLocaleString("es-MX", { style: "currency", currency: "MXN" })
                                        : "—"}
                                </span>
                            </div>
                            {selectedAircraft && (
                                <p className="text-[11px] text-muted">
                                    Calculado con {selectedAircraft.seats} asientos del{" "}
                                    {selectedAircraft.manufacturer
                                        ? `${selectedAircraft.manufacturer} ${selectedAircraft.model}`
                                        : selectedAircraft.model}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Flight Plan */}
                    <div className="flex-1 bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                        <h2 className="text-[11px] font-semibold text-text">Plan de vuelo</h2>
                        <p className="text-[11px] text-muted">Carga el PDF con el plan de vuelo detallado</p>
                        {existingPlanUrl && !flightPlan && (
                            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#FAFAFA] border border-border">
                                <span className="text-[12px] text-text truncate">Plan de vuelo actual</span>
                                <button
                                    onClick={() => setExistingPlanUrl(null)}
                                    className="text-[11px] text-muted hover:text-text ml-2 shrink-0"
                                >
                                    Eliminar
                                </button>
                            </div>
                        )}
                        {(!existingPlanUrl || flightPlan) && (
                            <DocumentUpload
                                accept=".pdf"
                                document={flightPlan ? { name: flightPlan.name, size: formatFileSize(flightPlan.size) } : undefined}
                                onUpload={(file) => { setFlightPlan(file); setExistingPlanUrl(null); }}
                                onRemove={() => setFlightPlan(null)}
                                pendingTitle="Plan de vuelo"
                                pendingDescription="Máximo 10 MB"
                            />
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4 pt-8">
                    <Button
                        onClick={() => handleSubmit(true)}
                        variant="primary"
                        className="w-60 h-10"
                        disabled={isPending}
                    >
                        {isPending ? "Actualizando..." : "Actualizar vuelo"}
                    </Button>
                    <Button
                        onClick={() => handleSubmit(false)}
                        variant="outline"
                        className="w-60 h-10"
                        disabled={isPending}
                    >
                        {isPending ? "Guardando..." : "Guardar borrador"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
