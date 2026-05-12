"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InputGroup } from "@/components/molecules/InputGroup";
import { ImageUpload } from "@/components/molecules/ImageUpload";
import { DocumentUpload, formatFileSize } from "@/components/molecules/DocumentUpload";
import { toast } from "@/components/atoms/Toast";
import { createClient } from "@/lib/supabase/client";
import { addAircraft } from "@/app/actions/aircraft";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    ownerId: string;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uniqueStoragePath(userId: string, ext: string | undefined): string {
    const ts  = Date.now();
    const rnd = Math.random().toString(36).slice(2);
    return `${userId}/${ts}-${rnd}.${ext}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddAircraftContent({ ownerId }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [photoFiles,       setPhotoFiles]       = useState<File[]>([]);
    const [proofOfOwnership, setProofOfOwnership] = useState<File | null>(null);
    const [permits,          setPermits]          = useState<File | null>(null);
    const [powerOfAttorney,  setPowerOfAttorney]  = useState<File | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { manufacturer: "", model: "", tailNumber: "", year: "", seats: "" },
    });

    const uploadToStorage = async (bucket: string, file: File, userId: string): Promise<string | null> => {
        const supabase = createClient();
        if (!supabase) return null;
        const ext  = file.name.split(".").pop();
        const path = uniqueStoragePath(userId, ext);
        const { error } = await supabase.storage.from(bucket).upload(path, file);
        if (error) { console.error(`[uploadToStorage] ${bucket}:`, error.message); return null; }
        if (bucket === "aircraft-photos") {
            const { data } = supabase.storage.from(bucket).getPublicUrl(path);
            return data.publicUrl;
        }
        const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 365);
        return data?.signedUrl ?? null;
    };

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            const supabase = createClient();
            if (!supabase) { toast.error("Error", "No se pudo conectar con el servidor"); return; }

            const { data: { user } } = await supabase.auth.getUser();
            const uid = user?.id ?? ownerId;

            const photoUrls: string[] = [];
            for (const file of photoFiles) {
                const url = await uploadToStorage("aircraft-photos", file, uid);
                if (url) photoUrls.push(url);
            }

            const docUploads: { type: string; url: string }[] = [];
            const docMap: [File | null, string][] = [
                [proofOfOwnership, "PROOF_OF_OWNERSHIP"],
                [permits,          "PERMITS"],
                [powerOfAttorney,  "POWER_OF_ATTORNEY"],
            ];
            for (const [file, type] of docMap) {
                if (!file) continue;
                const url = await uploadToStorage("aircraft-documents", file, uid);
                if (url) docUploads.push({ type, url });
            }

            const { error, id } = await addAircraft(ownerId, {
                ...data,
                manufacturer: data.manufacturer ?? "",
                year:         data.year         ?? "",
                photos:       photoUrls,
                documents:    docUploads,
            });

            if (error) {
                toast.error("Error al guardar", error);
            } else {
                toast.success(
                    "Aeronave registrada",
                    `${data.manufacturer ? data.manufacturer + " " : ""}${data.model} fue agregada exitosamente`,
                );
                router.push(id ? `/owner/aeronaves/${id}` : "/owner/aeronaves");
            }
        });
    });

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <Button
                    onClick={() => router.push("/owner/aeronaves")}
                    variant="link"
                    className="flex items-center gap-3 mb-5 p-0 text-sm font-medium text-text hover:opacity-70"
                >
                    <ArrowLeft className="w-6 h-6" />
                    Volver a aeronaves
                </Button>
                <div className="flex flex-col gap-2">
                    <h1 className="text-[32px] font-semibold text-text">Agregar aeronave</h1>
                    <p className="text-sm text-[#666666]">Registra una nueva aeronave para tu flota</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="px-12 pb-8 flex flex-col gap-7">
                {/* General Info */}
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

                {/* Images */}
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                    <h2 className="text-[11px] font-semibold text-text">Imágenes de la aeronave</h2>
                    <p className="text-xs text-[#666666]">Sube múltiples fotografías de tu aeronave</p>
                    <div className="flex flex-col gap-3">
                        {photoFiles.map((f, i) => (
                            <div key={i} className="flex items-center justify-between bg-neutral/10 rounded-lg px-4 py-2">
                                <span className="text-xs text-text truncate">{f.name}</span>
                                <button
                                    type="button"
                                    onClick={() => setPhotoFiles((prev) => prev.filter((_, idx) => idx !== i))}
                                    className="text-xs text-[#C62828] ml-4 shrink-0"
                                >
                                    Quitar
                                </button>
                            </div>
                        ))}
                        <ImageUpload
                            accept="image/png,image/jpeg,image/jpg"
                            onUpload={(file) => setPhotoFiles((prev) => [...prev, file])}
                            pendingTitle="Arrastra imágenes aquí o haz clic para cargar"
                            pendingDescription="PNG, JPG (máximo 5 MB cada una)"
                        />
                    </div>
                    <p className="text-[11px] text-[#666666]">Estas imágenes serán visibles para Mobius durante la validación</p>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                    <h2 className="text-[11px] font-semibold text-text">Documentación obligatoria</h2>
                    <div className="flex flex-col gap-4">
                        <p className="text-[11px] text-[#666666]">Todos los documentos serán revisados manualmente por Mobius Fly</p>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-text">Proof of ownership</label>
                            <DocumentUpload
                                accept=".pdf"
                                document={proofOfOwnership ? { name: proofOfOwnership.name, size: formatFileSize(proofOfOwnership.size) } : undefined}
                                onUpload={setProofOfOwnership}
                                onRemove={() => setProofOfOwnership(null)}
                                pendingDescription="Máximo 10 MB"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-text">Permisos AFAC / DGAC</label>
                            <DocumentUpload
                                accept=".pdf"
                                document={permits ? { name: permits.name, size: formatFileSize(permits.size) } : undefined}
                                onUpload={setPermits}
                                onRemove={() => setPermits(null)}
                                pendingDescription="Máximo 10 MB"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-text">Carta poder notariada</label>
                            <DocumentUpload
                                accept=".pdf"
                                document={powerOfAttorney ? { name: powerOfAttorney.name, size: formatFileSize(powerOfAttorney.size) } : undefined}
                                onUpload={setPowerOfAttorney}
                                onRemove={() => setPowerOfAttorney(null)}
                                pendingDescription="Máximo 10 MB"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4 pt-8">
                    <Button type="submit" variant="primary" className="w-60 h-10" disabled={isPending}>
                        {isPending ? "Guardando..." : "Guardar aeronave"}
                    </Button>
                    <Button type="button" onClick={() => router.push("/owner/aeronaves")} variant="outline" className="w-60 h-10" disabled={isPending}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}
