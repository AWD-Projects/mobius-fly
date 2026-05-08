"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InputGroup } from "@/components/molecules/InputGroup";
import { SelectGroup } from "@/components/molecules/SelectGroup";
import { toast } from "@/components/atoms/Toast";
import { addCrewMember } from "@/app/actions/crew";
import type { CrewRoleRow } from "@/app/actions/crew";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    ownerId:    string;
    crewRoles:  CrewRoleRow[];
}

// ─── Role display labels ──────────────────────────────────────────────────────

const ROLE_LABEL: Record<string, string> = {
    CAPTAIN:          "Capitán / Piloto",
    FIRST_OFFICER:    "Copiloto / Piloto",
    FLIGHT_ATTENDANT: "TCP / Sobrecargo",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AddCrewContent({ ownerId, crewRoles }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [form, setForm] = useState({
        firstName:     "",
        lastName:      "",
        crewRoleId:    "",
        licenseNumber: "",
        phone:         "",
    });

    const [errors, setErrors] = useState<Partial<typeof form>>({});

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

    const handleSave = () => {
        if (!validate()) return;

        startTransition(async () => {
            const { error } = await addCrewMember(ownerId, form);
            if (error) {
                toast.error("Error al guardar", error);
            } else {
                toast.success("Tripulante agregado", `${form.firstName} ${form.lastName} fue registrado exitosamente`);
                router.push("/owner/tripulacion");
            }
        });
    };

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
                        onClick={handleSave}
                        variant="primary"
                        className="w-60 h-10"
                        disabled={isPending}
                    >
                        {isPending ? "Guardando..." : "Guardar tripulante"}
                    </Button>
                    <Button
                        onClick={() => router.push("/owner/tripulacion")}
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
