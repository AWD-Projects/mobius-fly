"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InputGroup } from "@/components/molecules/InputGroup";
import { SelectGroup } from "@/components/molecules/SelectGroup";
import { toast } from "@/components/atoms/Toast";
import { updateCrewMember } from "@/app/actions/crew";
import type { CrewRoleRow } from "@/app/actions/crew";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    crewId:    string;
    ownerId:   string;
    crewRoles: CrewRoleRow[];
    initial: {
        firstName:     string;
        lastName:      string;
        crewRoleId:    string;
        licenseNumber: string;
        phone:         string;
    };
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

const ROLE_LABEL: Record<string, string> = {
    CAPTAIN:          "Capitán / Piloto",
    FIRST_OFFICER:    "Copiloto / Piloto",
    FLIGHT_ATTENDANT: "TCP / Sobrecargo",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function EditCrewContent({ crewId, ownerId, crewRoles, initial }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: initial,
    });

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            const { error } = await updateCrewMember(crewId, ownerId, {
                ...data,
                licenseNumber: data.licenseNumber ?? "",
                phone:         data.phone         ?? "",
            });
            if (error) {
                toast.error("Error al actualizar", error);
            } else {
                toast.success("Tripulante actualizado", `${data.firstName} ${data.lastName} fue actualizado exitosamente`);
                router.push(`/owner/tripulacion/${crewId}`);
            }
        });
    });

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <Button
                    onClick={() => router.push(`/owner/tripulacion/${crewId}`)}
                    variant="link"
                    className="flex items-center gap-3 mb-5 p-0 text-sm font-medium text-text hover:opacity-70"
                >
                    <ArrowLeft className="w-6 h-6" />
                    Volver al tripulante
                </Button>

                <div className="flex flex-col gap-2">
                    <h1 className="text-[32px] font-semibold text-text">Editar tripulante</h1>
                    <p className="text-sm text-[#666666]">Modifica la información del miembro de tripulación</p>
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
                                    {role.name ?? ROLE_LABEL[role.code] ?? role.code}
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
                    <Button type="submit" variant="primary" className="w-60 h-10" disabled={isPending}>
                        {isPending ? "Actualizando..." : "Actualizar tripulante"}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => router.push(`/owner/tripulacion/${crewId}`)}
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
