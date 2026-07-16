"use client";

import React, { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InputGroup } from "@/components/molecules/InputGroup";
import { toast } from "@/components/atoms/Toast";
import { updateAircraft, replaceAircraftDocument } from "@/app/actions/aircraft";
import { createClient } from "@/lib/supabase/client";
import type { AircraftDocumentRow } from "@/app/actions/aircraft";

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
    documents: AircraftDocumentRow[];
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

// ─── Config ───────────────────────────────────────────────────────────────────

const DOC_TYPE_LABEL: Record<string, string> = {
    PROOF_OF_OWNERSHIP: "Proof of ownership",
    PERMITS:            "Permisos AFAC / DGAC",
    POWER_OF_ATTORNEY:  "Carta poder notariada",
};

const DOC_STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
    APPROVED:       { label: "Validado",    bg: "#E8F5E9", text: "#2E7D32" },
    PENDING_REVIEW: { label: "En revisión", bg: "#FFF8E1", text: "#F57F17" },
    REJECTED:       { label: "Rechazado",   bg: "#FFEBEE", text: "#C62828" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function EditAircraftContent({ aircraftId, ownerId, initial, documents: initialDocuments }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [docs, setDocs] = useState<AircraftDocumentRow[]>(initialDocuments);
    const [replacingId, setReplacingId] = useState<string | null>(null);
    const showDocuments = initialDocuments.some((d) =>
        ["PENDING_REVIEW", "REJECTED"].includes(d.document_status?.code ?? "")
    );
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pendingDocIdRef = useRef<string | null>(null);

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

    const handleReplaceDocument = (docId: string) => {
        pendingDocIdRef.current = docId;
        fileInputRef.current?.click();
    };

    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        const docId = pendingDocIdRef.current;
        if (!file || !docId) return;

        const ALLOWED = ["application/pdf", "image/jpeg", "image/png"];
        if (!ALLOWED.includes(file.type)) {
            toast.error("Archivo no válido", "Solo se aceptan PDF, JPEG o PNG.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Archivo muy grande", "El archivo no puede superar 10 MB.");
            return;
        }

        setReplacingId(docId);
        try {
            const supabase = createClient();
            if (!supabase) { toast.error("Error", "No se pudo inicializar el cliente."); return; }
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { toast.error("Error", "No se pudo verificar tu sesión."); return; }

            const ext = file.name.split(".").pop() ?? "bin";
            const storagePath = `${aircraftId}/${crypto.randomUUID()}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from("aircraft-documents")
                .upload(storagePath, file, { contentType: file.type, upsert: false });

            if (uploadError) {
                toast.error("Error al subir", "No se pudo cargar el documento. Intenta de nuevo.");
                return;
            }

            const { error } = await replaceAircraftDocument(docId, ownerId, storagePath);
            if (error) {
                await supabase.storage.from("aircraft-documents").remove([storagePath]);
                toast.error("Error al actualizar", error);
                return;
            }

            setDocs((prev) =>
                prev.map((d) =>
                    d.id === docId
                        ? { ...d, document_url: storagePath, rejected_reason: null, document_status: { code: "PENDING_REVIEW" as const } }
                        : d,
                ),
            );
            toast.success("Documento enviado", "Tu documento está en revisión.");
        } finally {
            setReplacingId(null);
            pendingDocIdRef.current = null;
        }
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

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileSelected}
            />

            {/* Form */}
            <form onSubmit={onSubmit} className="px-12 pb-8 flex flex-col gap-7">
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                    <h2 className="text-[11px] font-semibold text-text">Información general</h2>
                    <div className="flex flex-col gap-4">
                        <InputGroup label="Fabricante" type="text" placeholder="p. ej. Cessna" {...register("manufacturer")} />
                        <InputGroup label="Modelo de la aeronave" type="text" placeholder="p. ej. 208B Grand Caravan" error={errors.model?.message} {...register("model")} />
                        <InputGroup label="Matrícula / Tail number" type="text" placeholder="p. ej. N2345XY" error={errors.tailNumber?.message} {...register("tailNumber")} />
                        <InputGroup
                            label="Año del avión"
                            type="text"
                            inputMode="numeric"
                            placeholder="p. ej. 2020"
                            {...register("year", {
                                onChange: (e) => {
                                    e.target.value = e.target.value.replace(/\D/g, "");
                                },
                            })}
                        />
                        <InputGroup
                            label="Número de asientos"
                            type="text"
                            inputMode="numeric"
                            placeholder="p. ej. 8"
                            error={errors.seats?.message}
                            {...register("seats", {
                                onChange: (e) => {
                                    e.target.value = e.target.value.replace(/\D/g, "");
                                },
                            })}
                        />
                    </div>
                </div>

                {/* Documents */}
                {showDocuments && (
                    <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                        <div className="flex flex-col gap-0.5">
                            <h2 className="text-[11px] font-semibold text-text">Documentación</h2>
                            <p className="text-[11px] text-muted">Reemplaza los documentos rechazados o en revisión.</p>
                        </div>
                        <div className="flex flex-col">
                            {docs.map((doc, index) => {
                                const statusCode = doc.document_status?.code ?? "PENDING_REVIEW";
                                const cfg = DOC_STATUS_CONFIG[statusCode] ?? DOC_STATUS_CONFIG.PENDING_REVIEW;
                                const isReplacing = replacingId === doc.id;
                                return (
                                    <div
                                        key={doc.id}
                                        className={`flex items-center justify-between py-4 ${index < docs.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}
                                    >
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[13px] font-medium text-text">
                                                {DOC_TYPE_LABEL[doc.document_type] ?? doc.document_type}
                                            </span>
                                            <span
                                                className="text-[10px] font-medium px-2 py-0.5 rounded inline-flex items-center gap-1.5 w-fit"
                                                style={{ backgroundColor: cfg.bg, color: cfg.text }}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.text }} />
                                                {cfg.label}
                                            </span>
                                            {doc.rejected_reason && (
                                                <span className="text-[11px] text-[#C62828]">{doc.rejected_reason}</span>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-8 px-3 text-[12px]"
                                            isLoading={isReplacing}
                                            disabled={isReplacing || !!replacingId}
                                            onClick={() => handleReplaceDocument(doc.id)}
                                        >
                                            {isReplacing ? "Subiendo..." : "Reemplazar"}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

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
