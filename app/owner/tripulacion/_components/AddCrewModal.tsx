"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InputGroup } from "@/components/molecules/InputGroup";
import { SelectGroup } from "@/components/molecules/SelectGroup";
import { toast } from "@/components/atoms/Toast";
import { addCrewMember } from "@/app/actions/crew";
import type { CrewListItem, CrewRoleRow } from "@/app/actions/crew";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    open:      boolean;
    ownerId:   string;
    crewRoles: CrewRoleRow[];
    onClose:   () => void;
    onSuccess: (member: CrewListItem) => void;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    firstName:     z.string().min(1, "El nombre es obligatorio"),
    lastName:      z.string().min(1, "El apellido es obligatorio"),
    crewRoleId:    z.string().min(1, "Selecciona un rol"),
    licenseNumber: z.string().min(1, "El número de licencia es obligatorio"),
    phone:         z.string().min(1, "El número de contacto es obligatorio"),
});

type FormData = z.infer<typeof schema>;

// ─── Role labels ──────────────────────────────────────────────────────────────

const ROLE_LABEL: Record<string, string> = {
    CAPTAIN:          "Capitán",
    FIRST_OFFICER:    "Copiloto",
    FLIGHT_ATTENDANT: "TCP",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AddCrewModal({ open, ownerId, crewRoles, onClose, onSuccess }: Props) {
    const [mounted, setMounted] = React.useState(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    React.useEffect(() => setMounted(true), []);

    const [isPending, setIsPending] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { firstName: "", lastName: "", crewRoleId: "", licenseNumber: "", phone: "" },
    });

    const handleClose = () => {
        if (isPending) return;
        reset();
        onClose();
    };

    const onSubmit = handleSubmit(async (data) => {
        setIsPending(true);
        const run = async () => {
            const { error, member } = await addCrewMember(ownerId, data);
            if (error) throw new Error(error);
            return member!;
        };

        try {
            const member = await toast.promise(run, {
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
            reset();
            onSuccess(member);
            onClose();
        } catch {
            // error already shown by toast
        } finally {
            setIsPending(false);
        }
    });

    if (!open || !mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-crew-modal-title"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0"
                style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-6 pb-4">
                    <div>
                        <h2 id="add-crew-modal-title" className="text-[15px] font-semibold text-text">
                            Agregar tripulante
                        </h2>
                        <p className="text-[12px] text-muted mt-0.5">
                            Registra a un nuevo miembro de tu tripulación
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isPending}
                        className="text-muted hover:text-text transition-colors disabled:opacity-40"
                        aria-label="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="px-6 pb-6 flex flex-col gap-4">
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
                        error={errors.licenseNumber?.message}
                        {...register("licenseNumber")}
                    />
                    <InputGroup
                        label="Número de contacto"
                        type="tel"
                        placeholder="p. ej. +52 5566 7766 43"
                        error={errors.phone?.message}
                        {...register("phone")}
                    />

                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-10 text-sm"
                            onClick={handleClose}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1 h-10 text-sm"
                            isLoading={isPending}
                        >
                            Guardar tripulante
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body,
    );
}
