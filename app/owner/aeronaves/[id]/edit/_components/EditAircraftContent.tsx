"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    manufacturer: z.string().optional(),
    model:        z.string().min(1, "El modelo es obligatorio"),
    tailNumber:   z.string().min(1, "La matrícula es obligatoria"),
    year:         z.string().optional(),
    seats:        z.string().refine(
        (v) => v.trim() !== "" && !isNaN(parseInt(v)),
        "Número de asientos requerido",
    ),
});

type FormData = z.infer<typeof schema>;

// ─── Component ────────────────────────────────────────────────────────────────

export function EditAircraftContent({ aircraftId, ownerId, initial }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: initial,
    });

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            const { error } = await updateAircraft(aircraftId, ownerId, {
                ...data,
                manufacturer: data.manufacturer ?? "",
                year:         data.year         ?? "",
            });
            if (error) {
                toast.error("Error al actualizar", error);
            } else {
                toast.success(
                    "Aeronave actualizada",
                    `${data.manufacturer ? data.manufacturer + " " : ""}${data.model} fue actualizada exitosamente`,
                );
                router.push(`/owner/aeronaves/${aircraftId}`);
            }
        });
    });

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
            <form onSubmit={onSubmit} className="px-12 pb-8 flex flex-col gap-7">
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                    <h2 className="text-[11px] font-semibold text-text">Información general</h2>
                    <div className="flex flex-col gap-4">
                        <InputGroup label="Fabricante" type="text" placeholder="p. ej. Cessna" {...register("manufacturer")} />
                        <InputGroup label="Modelo de la aeronave" type="text" placeholder="p. ej. 208B Grand Caravan" error={errors.model?.message} {...register("model")} />
                        <InputGroup label="Matrícula / Tail number" type="text" placeholder="p. ej. N2345XY" error={errors.tailNumber?.message} {...register("tailNumber")} />
                        <InputGroup label="Año del avión" type="text" placeholder="p. ej. 2020" {...register("year")} />
                        <InputGroup label="Número de asientos" type="text" placeholder="p. ej. 8" error={errors.seats?.message} {...register("seats")} />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4 pt-8">
                    <Button type="submit" variant="primary" className="w-60 h-10" disabled={isPending}>
                        {isPending ? "Actualizando..." : "Actualizar aeronave"}
                    </Button>
                    <Button type="button" onClick={() => router.push(`/owner/aeronaves/${aircraftId}`)} variant="outline" className="w-60 h-10" disabled={isPending}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}
