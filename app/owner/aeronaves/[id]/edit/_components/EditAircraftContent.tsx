"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InputGroup } from "@/components/molecules/InputGroup";
import { toast } from "@/components/atoms/Toast";
import { updateAircraft } from "@/app/actions/aircraft";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    aircraftId: string;
    ownerId:    string;
    initial: {
        model:        string;
        manufacturer: string;
        tailNumber:   string;
        year:         string;
        seats:        string;
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditAircraftContent({ aircraftId, ownerId, initial }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState(initial);
    const [errors, setErrors] = useState<Partial<typeof initial>>({});

    const set = (key: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const validate = () => {
        const next: Partial<typeof form> = {};
        if (!form.model.trim())      next.model     = "El modelo es obligatorio";
        if (!form.tailNumber.trim()) next.tailNumber = "La matrícula es obligatoria";
        if (!form.seats.trim() || isNaN(parseInt(form.seats))) next.seats = "Número de asientos requerido";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleUpdate = () => {
        if (!validate()) return;

        startTransition(async () => {
            const { error } = await updateAircraft(aircraftId, ownerId, form);
            if (error) {
                toast.error("Error al actualizar", error);
            } else {
                toast.success(
                    "Aeronave actualizada",
                    `${form.manufacturer ? form.manufacturer + " " : ""}${form.model} fue actualizada exitosamente`,
                );
                router.push(`/owner/aeronaves/${aircraftId}`);
            }
        });
    };

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <Button
                    onClick={() => router.push(`/owner/aeronaves/${aircraftId}`)}
                    variant="link"
                    className="flex items-center gap-3 mb-5 p-0 text-sm font-medium text-text hover:opacity-70"
                >
                    <ArrowLeft className="w-6 h-6" />
                    Volver a la aeronave
                </Button>

                <div className="flex flex-col gap-2">
                    <h1 className="text-[32px] font-semibold text-text">Editar aeronave</h1>
                    <p className="text-sm text-[#666666]">Modifica la información de tu aeronave</p>
                </div>
            </div>

            {/* Form */}
            <div className="px-12 pb-8 flex flex-col gap-7">
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                    <h2 className="text-[11px] font-semibold text-text">Información general</h2>

                    <div className="flex flex-col gap-4">
                        <InputGroup
                            label="Fabricante"
                            type="text"
                            value={form.manufacturer}
                            onChange={set("manufacturer")}
                            placeholder="p. ej. Cessna"
                        />

                        <InputGroup
                            label="Modelo de la aeronave"
                            type="text"
                            value={form.model}
                            onChange={set("model")}
                            placeholder="p. ej. 208B Grand Caravan"
                            error={errors.model}
                        />

                        <InputGroup
                            label="Matrícula / Tail number"
                            type="text"
                            value={form.tailNumber}
                            onChange={set("tailNumber")}
                            placeholder="p. ej. N2345XY"
                            error={errors.tailNumber}
                        />

                        <InputGroup
                            label="Año del avión"
                            type="text"
                            value={form.year}
                            onChange={set("year")}
                            placeholder="p. ej. 2020"
                        />

                        <InputGroup
                            label="Número de asientos"
                            type="text"
                            value={form.seats}
                            onChange={set("seats")}
                            placeholder="p. ej. 8"
                            error={errors.seats}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4 pt-8">
                    <Button
                        onClick={handleUpdate}
                        variant="primary"
                        className="w-60 h-10"
                        disabled={isPending}
                    >
                        {isPending ? "Actualizando..." : "Actualizar aeronave"}
                    </Button>
                    <Button
                        onClick={() => router.push(`/owner/aeronaves/${aircraftId}`)}
                        variant="outline"
                        className="w-60 h-10"
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
}
