"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InputGroup } from "@/components/molecules/InputGroup";
import { SelectGroup } from "@/components/molecules/SelectGroup";
import { toast } from "@/components/atoms/Toast";
import { addCrewMember } from "@/app/actions/crew";
import type { CrewRoleRow } from "@/app/actions/crew";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    ownerId:   string;
    crewRoles: CrewRoleRow[];
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    firstName:     z.string().min(1, "El nombre es obligatorio"),
    lastName:      z.string().min(1, "El apellido es obligatorio"),
    crewRoleId:    z.string().min(1, "Selecciona un rol"),
    licenseNumber: z.string().optional(),
    phone:         z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// ─── Role display labels ──────────────────────────────────────────────────────

const ROLE_LABEL: Record<string, string> = {
    CAPTAIN:          "Capitán",
    FIRST_OFFICER:    "Copiloto",
    FLIGHT_ATTENDANT: "TCP",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AddCrewContent({ ownerId, crewRoles }: Props) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { firstName: "", lastName: "", crewRoleId: "", licenseNumber: "", phone: "" },
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsPending(true);
        const run = async () => {
            const { error } = await addCrewMember(ownerId, {
                ...data,
                licenseNumber: data.licenseNumber ?? "",
                phone:         data.phone         ?? "",
            });
            if (error) throw new Error(error);
        };

        try {
            await toast.promise(run, {
                loading: { title: "Guardando tripulante", description: "Registrando información..." },
                success: () => ({
                    title: "Tripulante agregado",
                    description: `${data.firstName} ${data.lastName} fue registrado exitosamente`,
                }),
                error: (err: unknown) => ({
                    title: "Error al guardar",
                    description: err instanceof Error ? err.message : String(err),
                }),
            });
            router.push("/owner/tripulacion");
        } catch {
            // error already shown by toast
        } finally {
            setIsPending(false);
        }
    });

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <Button
                    onClick={() => router.push("/owner/tripulacion")}
                    variant="link"
                    className="flex items-center gap-3 mb-5 p-0 text-sm font-medium text-text hover:opacity-70"
                >
                    <ArrowLeft className="w-6 h-6" />
                    Volver a tripulación
                </Button>

                <div className="flex flex-col gap-2">
                    <h1 className="text-[32px] font-semibold text-text">Agregar tripulante</h1>
                    <p className="text-sm text-[#666666]">
                        Registra a los miembros de tu tripulación para poder asignarlos a vuelos
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="px-12 pb-8 flex flex-col gap-7">
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                    <h2 className="text-[11px] font-semibold text-text">Información del tripulante</h2>

                    <div className="flex flex-col gap-4">
                        <InputGroup
                            label="Nombre(s)"
                            type="text"
                            placeholder="p. ej. Juan"
                            error={errors.firstName?.message}
                            {...register("firstName")}
                        />

                        <InputGroup
                            label="Apellido(s)"
                            type="text"
                            placeholder="p. ej. Pérez García"
                            error={errors.lastName?.message}
                            {...register("lastName")}
                        />

                        <SelectGroup
                            label="Rol del tripulante"
                            helperText="El rol define la disponibilidad del tripulante en diferentes tipos de vuelos"
                            error={errors.crewRoleId?.message}
                            {...register("crewRoleId")}
                        >
                            <option value="" disabled>Selecciona un rol</option>
                            {crewRoles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {ROLE_LABEL[role.code] ?? role.name ?? role.code}
                                </option>
                            ))}
                        </SelectGroup>

                        <InputGroup
                            label="Número de licencia"
                            type="text"
                            placeholder="p. ej. PEC-2023-45678"
                            {...register("licenseNumber")}
                        />

                        <InputGroup
                            label="Número de contacto"
                            type="tel"
                            placeholder="p. ej. +52 5566 7766 43"
                            {...register("phone")}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4 pt-8">
                    <Button type="submit" variant="primary" className="w-60 h-10" isLoading={isPending}>
                        Guardar tripulante
                    </Button>
                    <Button
                        type="button"
                        onClick={() => router.push("/owner/tripulacion")}
                        variant="outline"
                        className="w-60 h-10"
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}
