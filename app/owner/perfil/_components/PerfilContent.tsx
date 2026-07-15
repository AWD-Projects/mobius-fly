"use client";

import React, { useTransition, useRef, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { toast } from "@/components/atoms/Toast";
import { createClient } from "@/lib/supabase/client";
import { updateFleetName, replaceOwnerDocument, getDocumentSignedUrl } from "@/app/actions/owner";
import type { OwnerRow, OwnerDocumentRow, UserProfileSnapshot } from "@/app/actions/owner";
import type { DocumentStatusCode } from "@/types/app.types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    owner:       OwnerRow;
    documents:   OwnerDocumentRow[];
    userProfile: UserProfileSnapshot;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    fleetName: z
        .string()
        .min(1, "El nombre de la flota no puede estar vacío")
        .max(60, "Máximo 60 caracteres")
        .regex(/^[a-zA-ZÀ-ÿ0-9\s\-]+$/, "Solo se permiten letras, números, espacios y guiones"),
});

type FormData = z.infer<typeof schema>;

// ─── Config maps ──────────────────────────────────────────────────────────────

const DOCUMENT_LABELS: Record<string, string> = {
    INE:      "INE / Cédula de identidad",
    PASSPORT: "Pasaporte",
};

const DOC_STATUS_CONFIG: Record<DocumentStatusCode, { label: string; bg: string; dot: string; text: string }> = {
    APPROVED:       { label: "Aprobado",    bg: "bg-[#E8F5E9]", dot: "bg-[#2E7D32]", text: "text-[#2E7D32]" },
    PENDING_REVIEW: { label: "En revisión", bg: "bg-[#FFF8E1]", dot: "bg-[#F9A825]", text: "text-[#F9A825]" },
    REJECTED:       { label: "Rechazado",   bg: "bg-[#FFEBEE]", dot: "bg-[#C62828]", text: "text-[#C62828]" },
};

const OWNER_STATUS_CONFIG: Record<string, { label: string; bg: string; dot: string; text: string }> = {
    ACTIVE:             { label: "Verificado", bg: "bg-[#E8F5E9]", dot: "bg-[#2E7D32]", text: "text-[#2E7D32]" },
    PENDING_ONBOARDING: { label: "Pendiente",  bg: "bg-[#FFF8E1]", dot: "bg-[#F9A825]", text: "text-[#F9A825]" },
    SUSPENDED:          { label: "Suspendido", bg: "bg-[#FFEBEE]", dot: "bg-[#C62828]", text: "text-[#C62828]" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PerfilContent({ owner, documents: initialDocuments, userProfile }: Props) {
    const [isPending, startTransition] = useTransition();
    const [docs, setDocs] = useState<OwnerDocumentRow[]>(initialDocuments);
    const [replacingId, setReplacingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pendingDocIdRef = useRef<string | null>(null);

    const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { fleetName: owner.fleet_name ?? "" },
    });

    const currentFleetName = useWatch({ control, name: "fleetName" });
    const isDirty = (currentFleetName ?? "") !== (owner.fleet_name ?? "");

    // Signed URL for approved document preview (generated server-side via admin client)
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    useEffect(() => {
        const approvedDoc = docs.find((d) => d.document_status?.code === "APPROVED");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (!approvedDoc) { setSignedUrl(null); return; }
        getDocumentSignedUrl(approvedDoc.id).then(({ url }) => setSignedUrl(url));
    }, [docs]);

    const ownerStatusCfg = OWNER_STATUS_CONFIG[owner.status] ?? OWNER_STATUS_CONFIG.PENDING_ONBOARDING;

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            const { error } = await updateFleetName(owner.id, data.fleetName ?? "");
            if (error) {
                toast.error("Error al guardar", error);
            } else {
                toast.success("Cambios guardados", "Nombre de flota actualizado");
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
            if (!supabase) { toast.error("Error", "No se pudo conectar con el servidor."); return; }
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { toast.error("Error", "No se pudo verificar tu sesión."); return; }

            const ext = file.name.split(".").pop() ?? "bin";
            const storagePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from("identity-documents")
                .upload(storagePath, file, { contentType: file.type, upsert: false });

            if (uploadError) {
                toast.error("Error al subir", "No se pudo cargar el documento. Intenta de nuevo.");
                return;
            }

            const { error } = await replaceOwnerDocument(docId, storagePath);
            if (error) {
                await supabase.storage.from("identity-documents").remove([storagePath]);
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
            <div className="flex items-center justify-between px-12 py-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[26px] font-semibold text-text">Perfil</h1>
                    <p className="text-sm text-[#999999]">Configuración de cuenta del propietario</p>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-[#999999]">Estado de la cuenta</span>
                    <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md ${ownerStatusCfg.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ownerStatusCfg.dot}`} />
                        <span className={`text-xs font-semibold ${ownerStatusCfg.text}`}>{ownerStatusCfg.label}</span>
                    </div>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png"
                className="hidden"
                onChange={handleFileSelected}
            />

            <div className="px-12 pb-8 flex flex-col gap-6">

                {/* Fila 1 — Nombre de flota + Documento (2 columnas iguales, misma altura) */}
                <div className="flex gap-6 items-stretch">
                    {/* Fleet Name */}
                    <form onSubmit={onSubmit} className="flex-1 bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-text">Nombre de la flota</h2>
                            <IconButton
                                type="submit"
                                variant="ghost"
                                size="sm"
                                icon={<Check className="w-4 h-4 text-muted" />}
                                tooltip="Guardar cambios"
                                disabled={!isDirty || isPending}
                                className="transition-opacity disabled:opacity-0 disabled:pointer-events-none"
                            />
                        </div>
                        <Input type="text" className="h-10" error={!!errors.fleetName} {...register("fleetName")} />
                        {errors.fleetName && (
                            <p className="text-[11px] text-[#C62828]">{errors.fleetName.message}</p>
                        )}
                    </form>

                    {/* Identity document */}
                    <div className="flex-1 bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <h2 className="text-sm font-semibold text-text">Documento de identidad</h2>

                        {docs.length === 0 ? (
                            <p className="text-xs text-[#999999]">No hay documentos cargados.</p>
                        ) : (
                            docs.map((doc) => {
                                const statusCode = (doc.document_status?.code ?? "PENDING_REVIEW") as DocumentStatusCode;
                                const cfg = DOC_STATUS_CONFIG[statusCode] ?? DOC_STATUS_CONFIG.PENDING_REVIEW;
                                const isReplacing = replacingId === doc.id;
                                const isApproved = statusCode === "APPROVED";

                                return (
                                    <div key={doc.id} className="flex flex-col gap-3">
                                        {/* Tipo + badge */}
                                        <div className="flex items-center justify-end">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${cfg.bg}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                <span className={`text-[11px] font-medium ${cfg.text}`}>{cfg.label}</span>
                                            </div>
                                        </div>

                                        {/* Razón de rechazo */}
                                        {doc.rejected_reason && (
                                            <p className="text-[11px] text-[#C62828] bg-[#FFEBEE] rounded-lg px-3 py-2">
                                                {doc.rejected_reason}
                                            </p>
                                        )}

                                        {isApproved ? (
                                            <a
                                                href={signedUrl ?? "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-full h-9 text-xs inline-flex items-center justify-center rounded-sm border border-border bg-transparent hover:bg-neutral/10 transition-colors font-medium text-text ${!signedUrl ? "pointer-events-none opacity-50" : ""}`}
                                            >
                                                Ver documento
                                            </a>
                                        ) : (
                                            /* Reemplazar solo si PENDING_REVIEW o REJECTED */
                                            <Button
                                                type="button"
                                                onClick={() => handleReplaceDocument(doc.id)}
                                                variant="outline"
                                                className="w-full h-9 text-xs"
                                                isLoading={isReplacing}
                                                disabled={replacingId !== null}
                                            >
                                                {isReplacing ? "Subiendo..." : "Reemplazar documento"}
                                            </Button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Fila 2 — Datos personales (ancho completo) */}
                <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                    <h2 className="text-sm font-semibold text-text">Datos personales</h2>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between py-3 border-b border-[#F0F0F0]">
                            <span className="text-xs font-medium text-[#999999]">Nombre completo</span>
                            <span className="text-[13px] font-semibold text-text">
                                {`${userProfile.first_name} ${userProfile.last_name}`.trim() || "—"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-[#F0F0F0]">
                            <span className="text-xs font-medium text-[#999999]">Correo electrónico</span>
                            <span className="text-[13px] font-semibold text-text">{userProfile.email || "—"}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-[#F0F0F0]">
                            <span className="text-xs font-medium text-[#999999]">Teléfono</span>
                            <span className="text-[13px] font-semibold text-text">
                                {userProfile.phone ? `${userProfile.country_code ?? ""} ${userProfile.phone}`.trim() : "—"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-[#F0F0F0]">
                            <span className="text-xs font-medium text-[#999999]">Rol</span>
                            <span className="text-[13px] font-semibold text-text">
                                {userProfile.role === "OWNER" ? "Propietario / Admin" : (userProfile.role || "—")}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-xs font-medium text-[#999999]">Nacionalidad</span>
                            <span className="text-[13px] font-semibold text-text">{userProfile.nationality || "—"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
