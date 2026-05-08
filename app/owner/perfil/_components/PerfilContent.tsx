"use client";

import React, { useState, useTransition } from "react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { toast } from "@/components/atoms/Toast";
import { updateFleetName } from "@/app/actions/owner";
import type { OwnerRow, OwnerDocumentRow, UserProfileSnapshot } from "@/app/actions/owner";
import type { DocumentStatusCode } from "@/types/app.types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    owner:       OwnerRow;
    documents:   OwnerDocumentRow[];
    userProfile: UserProfileSnapshot;
}

// ─── Config maps ──────────────────────────────────────────────────────────────

const DOCUMENT_LABELS: Record<string, string> = {
    INE:      "INE / Cédula de identidad",
    PASSPORT: "Pasaporte",
};

const DOC_STATUS_CONFIG: Record<DocumentStatusCode, { label: string; bg: string; dot: string; text: string }> = {
    APPROVED: { label: "Aprobado",    bg: "bg-[#E8F5E9]", dot: "bg-[#2E7D32]", text: "text-[#2E7D32]" },
    PENDING:  { label: "En revisión", bg: "bg-[#FFF8E1]", dot: "bg-[#F9A825]", text: "text-[#F9A825]" },
    REJECTED: { label: "Rechazado",   bg: "bg-[#FFEBEE]", dot: "bg-[#C62828]", text: "text-[#C62828]" },
};

const OWNER_STATUS_CONFIG: Record<string, { label: string; bg: string; dot: string; text: string }> = {
    ACTIVE:             { label: "Verificado", bg: "bg-[#E8F5E9]", dot: "bg-[#2E7D32]", text: "text-[#2E7D32]" },
    PENDING_ONBOARDING: { label: "Pendiente",  bg: "bg-[#FFF8E1]", dot: "bg-[#F9A825]", text: "text-[#F9A825]" },
    SUSPENDED:          { label: "Suspendido", bg: "bg-[#FFEBEE]", dot: "bg-[#C62828]", text: "text-[#C62828]" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PerfilContent({ owner, documents, userProfile }: Props) {
    const [fleetName, setFleetName] = useState(owner.fleet_name ?? "");
    const [isPending, startTransition] = useTransition();

    const ownerStatusCfg = OWNER_STATUS_CONFIG[owner.status] ?? OWNER_STATUS_CONFIG.PENDING_ONBOARDING;

    const handleSaveFleetName = () => {
        startTransition(async () => {
            const { error } = await updateFleetName(owner.id, fleetName);
            if (error) {
                toast.error("Error al guardar", error);
            } else {
                toast.success("Cambios guardados", "Nombre de flota actualizado");
            }
        });
    };

    const handleReplaceDocument = (id: string) => {
        console.log("Replace document:", id);
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

            {/* Main Content */}
            <div className="px-12 pb-8 flex flex-col gap-6">
                {/* Fleet Name */}
                <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                    <h2 className="text-sm font-semibold text-text">Nombre de la flota</h2>
                    <p className="text-xs text-[#999999]">Nombre identificador de tu flota</p>

                    <Input
                        type="text"
                        value={fleetName}
                        onChange={(e) => setFleetName(e.target.value)}
                        className="h-10"
                    />

                    <Button
                        onClick={handleSaveFleetName}
                        variant="primary"
                        className="w-40 h-10"
                        disabled={isPending}
                    >
                        {isPending ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>

                {/* Personal Data */}
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
                                {userProfile.phone
                                    ? `${userProfile.country_code ?? ""} ${userProfile.phone}`.trim()
                                    : "—"}
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

                {/* Documents */}
                <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                    <h2 className="text-sm font-semibold text-text">Documentos del propietario</h2>

                    {documents.length === 0 ? (
                        <p className="text-xs text-[#999999]">No hay documentos cargados.</p>
                    ) : (
                        <div className="w-full">
                            <div className="bg-[#FAFAFA] rounded-t-lg px-6 py-3.5 border-b border-border flex items-center">
                                <div style={{ width: 220 }}>
                                    <span className="text-xs font-medium text-[#666666]">Documento</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span className="text-xs font-medium text-[#666666]">Estado</span>
                                </div>
                                <div style={{ width: 150 }}>
                                    <span className="text-xs font-medium text-[#666666]">Acción</span>
                                </div>
                            </div>

                            {documents.map((doc, index) => {
                                const statusCode = (doc.document_status?.code ?? "PENDING") as DocumentStatusCode;
                                const cfg = DOC_STATUS_CONFIG[statusCode] ?? DOC_STATUS_CONFIG.PENDING;
                                return (
                                    <div
                                        key={doc.id}
                                        className={`flex items-center px-6 py-[18px] ${
                                            index < documents.length - 1 ? "border-b border-[#F0F0F0]" : ""
                                        }`}
                                    >
                                        <div style={{ width: 220 }}>
                                            <span className="text-[13px] font-medium text-text">
                                                {DOCUMENT_LABELS[doc.document_type] ?? doc.document_type}
                                            </span>
                                        </div>
                                        <div style={{ flex: 1 }} className="flex flex-col gap-1">
                                            <div className={`inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-md ${cfg.bg}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
                                            </div>
                                            {doc.rejected_reason && (
                                                <span className="text-[11px] text-[#C62828]">{doc.rejected_reason}</span>
                                            )}
                                        </div>
                                        <div style={{ width: 150 }}>
                                            <Button
                                                onClick={() => handleReplaceDocument(doc.id)}
                                                variant="link"
                                                className="h-auto p-0 text-xs text-info"
                                            >
                                                Reemplazar
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
