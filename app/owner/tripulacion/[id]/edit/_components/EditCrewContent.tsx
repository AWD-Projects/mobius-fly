"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

const ROLE_LABEL: Record<string, string> = {
    CAPTAIN:          "Capitán / Piloto",
    FIRST_OFFICER:    "Copiloto / Piloto",
    FLIGHT_ATTENDANT: "TCP / Sobrecargo",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function EditCrewContent({ crewId, ownerId, crewRoles, initial }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState(initial);
    const [errors, setErrors] = useState<Partial<typeof initial>>({});

    const set = (key: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const validate = () => {
        const next: Partial<typeof form> = {};
        if (!form.firstName.trim())  next.firstName  = "El nombre es obligatorio";
        if (!form.lastName.trim())   next.lastName   = "El apellido es obligatorio";
        if (!form.crewRoleId)        next.crewRoleId = "Selecciona un rol";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleUpdate = () => {
        if (!validate()) return;

        startTransition(async () => {
            const { error } = await updateCrewMember(crewId, ownerId, form);
            if (error) {
                toast.error("Error al actualizar", error);
            } else {
                toast.success("Tripulante actualizado", `${form.firstName} ${form.lastName} fue actualizado exitosamente`);
                router.push(`/owner/tripulacion/${crewId}`);
            }
        });
    };

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
                    <p className="text-sm text-[#666666]">
                        Modifica la información del miembro de tripulación
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="px-12 pb-8 flex flex-col gap-7">
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                    <h2 className="text-[11px] font-semibold text-text">Información del tripulante</h2>

                    <div className="flex flex-col gap-4">
                        <InputGroup
                            label="Nombre(s)"
                            type="text"
                            value={form.firstName}
                            onChange={set("firstName")}
                            placeholder="p. ej. Juan"
                            error={errors.firstName}
                        />

                        <InputGroup
                            label="Apellido(s)"
                            type="text"
                            value={form.lastName}
                            onChange={set("lastName")}
                            placeholder="p. ej. Pérez García"
                            error={errors.lastName}
                        />

                        <SelectGroup
                            label="Rol del tripulante"
                            value={form.crewRoleId}
                            onChange={set("crewRoleId")}
                            helperText="El rol define la disponibilidad del tripulante en diferentes tipos de vuelos"
                            error={errors.crewRoleId}
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
                            value={form.licenseNumber}
                            onChange={set("licenseNumber")}
                            placeholder="p. ej. PEC-2023-45678"
                        />

                        <InputGroup
                            label="Número de contacto"
                            type="tel"
                            value={form.phone}
                            onChange={set("phone")}
                            placeholder="p. ej. +52 5566 7766 43"
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
                        {isPending ? "Actualizando..." : "Actualizar tripulante"}
                    </Button>
                    <Button
                        onClick={() => router.push(`/owner/tripulacion/${crewId}`)}
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
