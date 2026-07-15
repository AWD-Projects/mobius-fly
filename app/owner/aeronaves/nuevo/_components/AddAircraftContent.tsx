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
import { ImageUpload } from "@/components/molecules/ImageUpload";
import { DocumentUpload, formatFileSize } from "@/components/molecules/DocumentUpload";
import { toast } from "@/components/atoms/Toast";
import { createClient } from "@/lib/supabase/client";
import { addAircraft } from "@/app/actions/aircraft";
import type { AircraftType } from "@/app/actions/aircraft";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    ownerId: string;
}

// ─── Aircraft types ───────────────────────────────────────────────────────────

const AIRCRAFT_TYPE_VALUES = [
    "vlj", "light", "midsize", "super_midsize", "heavy",
    "ultra_long", "turboprop", "piston", "helicopter",
] as const;

const AIRCRAFT_TYPES: { value: AircraftType; label: string }[] = [
    { value: "vlj",          label: "Jet Muy Ligero (VLJ)" },
    { value: "light",        label: "Jet Ligero"            },
    { value: "midsize",      label: "Jet Mediano"           },
    { value: "super_midsize",label: "Jet Super Mediano"     },
    { value: "heavy",        label: "Jet Pesado"            },
    { value: "ultra_long",   label: "Ultra Largo Alcance"   },
    { value: "turboprop",    label: "Turbohélice"           },
    { value: "piston",       label: "Pistón / Hélice"       },
    { value: "helicopter",   label: "Helicóptero"           },
];

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    manufacturer: z.string().min(1, "El fabricante es obligatorio"),
    model:        z.string().min(1, "El modelo es obligatorio"),
    tailNumber:   z.string().min(1, "La matrícula es obligatoria"),
    year:         z.string().min(1, "El año es obligatorio"),
    seats:        z.string().refine(
        (v) => v.trim() !== "" && !isNaN(parseInt(v)) && parseInt(v) > 0,
        "Número de asientos requerido",
    ),
    aircraftType: z.enum(AIRCRAFT_TYPE_VALUES, { message: "Selecciona un tipo de aeronave" }),
});

type FormData = z.infer<typeof schema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_PHOTOS   = 10;
const MAX_PHOTO_MB = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uniqueStoragePath(userId: string, ext: string | undefined): string {
    const ts  = Date.now();
    const rnd = Math.random().toString(36).slice(2);
    return `${userId}/${ts}-${rnd}.${ext}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddAircraftContent({ ownerId }: Props) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const [photoFiles,       setPhotoFiles]       = useState<{ file: File; preview: string }[]>([]);
    const [photoError,       setPhotoError]       = useState(false);
    const [proofOfOwnership, setProofOfOwnership] = useState<File | null>(null);
    const [permits,          setPermits]          = useState<File | null>(null);
    const [powerOfAttorney,  setPowerOfAttorney]  = useState<File | null>(null);
    const [docErrors,        setDocErrors]        = useState({ proof: false, permits: false, attorney: false });

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

    const addPhoto = (file: File) => {
        if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
            toast.error("Imagen demasiado grande", `El tamaño máximo por imagen es ${MAX_PHOTO_MB} MB`);
            return;
        }
        setPhotoFiles((prev) => [...prev, { file, preview: URL.createObjectURL(file) }]);
        setPhotoError(false);
    };

    const removePhoto = (i: number) => {
        setPhotoFiles((prev) => {
            URL.revokeObjectURL(prev[i].preview);
            return prev.filter((_, idx) => idx !== i);
        });
    };

    const onSubmit = handleSubmit(async (data) => {
        const missingPhoto    = photoFiles.length === 0;
        const missingProof    = !proofOfOwnership;
        const missingPermits  = !permits;
        const missingAttorney = !powerOfAttorney;

        setPhotoError(missingPhoto);
        setDocErrors({ proof: missingProof, permits: missingPermits, attorney: missingAttorney });

        if (missingPhoto || missingProof || missingPermits || missingAttorney) return;
        setIsPending(true);
        const run = async () => {
            const supabase = createClient();
            if (!supabase) throw new Error("No se pudo conectar con el servidor");
            const { data: { user } } = await supabase.auth.getUser();
            const uid = user?.id ?? ownerId;

            const photoUrls: string[] = [];
            for (const { file } of photoFiles) {
                const url = await uploadToStorage("aircraft-photos", file, uid);
                if (url) photoUrls.push(url);
            }

            const docUploads: { type: string; url: string }[] = [];
            for (const [file, type] of [
                [proofOfOwnership, "PROOF_OF_OWNERSHIP"],
                [permits,          "PERMITS"],
                [powerOfAttorney,  "POWER_OF_ATTORNEY"],
            ] as [File | null, string][]) {
                if (!file) continue;
                const url = await uploadToStorage("aircraft-documents", file, uid);
                if (url) docUploads.push({ type, url });
            }

            const { error, id } = await addAircraft(ownerId, {
                manufacturer: data.manufacturer,
                model:        data.model,
                tailNumber:   data.tailNumber,
                year:         data.year,
                seats:        data.seats,
                aircraftType: data.aircraftType,
                photos:       photoUrls,
                documents:    docUploads,
            });

            if (error) throw new Error(error);
            return id;
        };

        try {
            const id = await toast.promise(run, {
                loading: { title: "Guardando aeronave", description: "Subiendo archivos y registrando datos..." },
                success: () => ({
                    title: "Aeronave registrada",
                    description: `${data.manufacturer} ${data.model} fue agregada exitosamente`,
                }),
                error: (err: unknown) => ({
                    title: "Error al guardar",
                    description: err instanceof Error ? err.message : String(err),
                }),
            });
            router.push(id ? `/owner/aeronaves/${id}` : "/owner/aeronaves");
        } catch {
            // error already shown by toast
        } finally {
            setIsPending(false);
        }
    });

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            <form onSubmit={onSubmit}>
                {/* Header */}
                <div className="px-12 py-8 flex items-end justify-between">
                    <div>
                        <Button
                            type="button"
                            onClick={() => router.push("/owner/aeronaves")}
                            variant="link"
                            className="flex items-center gap-3 mb-5 p-0 text-sm font-medium text-text hover:opacity-70"
                        >
                            <ArrowLeft className="w-6 h-6" />
                            Volver a aeronaves
                        </Button>
                        <h1 className="text-[32px] font-semibold text-text">Agregar aeronave</h1>
                        <p className="text-sm text-[#666666]">Registra una nueva aeronave para tu flota</p>
                    </div>
                    <div className="flex items-center gap-3 pb-1">
                        <Button
                            type="button"
                            onClick={() => router.push("/owner/aeronaves")}
                            variant="outline"
                            className="h-10 px-6"
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" className="h-10 px-6" isLoading={isPending}>
                            Guardar aeronave
                        </Button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-12 pb-12 flex flex-col gap-7">
                    {/* Row 1: two columns */}
                    <div className="grid grid-cols-2 gap-7 items-stretch">
                        {/* LEFT: Info */}
                        <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                            <h2 className="text-[11px] font-semibold text-text">Información general</h2>
                            <div className="flex flex-col gap-4">
                                <InputGroup
                                    label="Fabricante"
                                    type="text"
                                    placeholder="p. ej. Cessna"
                                    error={errors.manufacturer?.message}
                                    {...register("manufacturer")}
                                />
                                <InputGroup
                                    label="Modelo de la aeronave"
                                    type="text"
                                    placeholder="p. ej. 208B Grand Caravan"
                                    error={errors.model?.message}
                                    {...register("model")}
                                />
                                <InputGroup
                                    label="Matrícula / Tail number"
                                    type="text"
                                    placeholder="p. ej. N2345XY"
                                    error={errors.tailNumber?.message}
                                    {...register("tailNumber")}
                                />
                                <InputGroup
                                    label="Año del avión"
                                    type="text"
                                    placeholder="p. ej. 2020"
                                    error={errors.year?.message}
                                    {...register("year")}
                                />
                                <InputGroup
                                    label="Número de asientos"
                                    type="text"
                                    placeholder="p. ej. 8"
                                    error={errors.seats?.message}
                                    {...register("seats")}
                                />
                                <SelectGroup
                                    label="Tipo de aeronave"
                                    error={errors.aircraftType?.message}
                                    {...register("aircraftType")}
                                >
                                    <option value="">Selecciona un tipo</option>
                                    {AIRCRAFT_TYPES.map(({ value, label }) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </SelectGroup>
                            </div>
                        </div>

                        {/* RIGHT: Documents */}
                        <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                            <div>
                                <h2 className="text-[11px] font-semibold text-text">Documentación obligatoria</h2>
                                <p className="text-[11px] text-[#666666] mt-1">Todos los documentos serán revisados manualmente por Mobius Fly</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-text">Proof of ownership</label>
                                    <DocumentUpload
                                        accept=".pdf"
                                        document={proofOfOwnership ? { name: proofOfOwnership.name, size: formatFileSize(proofOfOwnership.size) } : undefined}
                                        onUpload={(f) => {
                                            if (f.size > 10 * 1024 * 1024) { toast.error("Archivo demasiado grande", "El documento no puede superar los 10 MB."); return; }
                                            setProofOfOwnership(f); setDocErrors((e) => ({ ...e, proof: false }));
                                        }}
                                        onRemove={() => setProofOfOwnership(null)}
                                        pendingDescription="Máximo 10 MB"
                                        error={docErrors.proof}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-text">Permisos AFAC / DGAC</label>
                                    <DocumentUpload
                                        accept=".pdf"
                                        document={permits ? { name: permits.name, size: formatFileSize(permits.size) } : undefined}
                                        onUpload={(f) => {
                                            if (f.size > 10 * 1024 * 1024) { toast.error("Archivo demasiado grande", "El documento no puede superar los 10 MB."); return; }
                                            setPermits(f); setDocErrors((e) => ({ ...e, permits: false }));
                                        }}
                                        onRemove={() => setPermits(null)}
                                        pendingDescription="Máximo 10 MB"
                                        error={docErrors.permits}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-text">Carta poder notariada</label>
                                    <DocumentUpload
                                        accept=".pdf"
                                        document={powerOfAttorney ? { name: powerOfAttorney.name, size: formatFileSize(powerOfAttorney.size) } : undefined}
                                        onUpload={(f) => {
                                            if (f.size > 10 * 1024 * 1024) { toast.error("Archivo demasiado grande", "El documento no puede superar los 10 MB."); return; }
                                            setPowerOfAttorney(f); setDocErrors((e) => ({ ...e, attorney: false }));
                                        }}
                                        onRemove={() => setPowerOfAttorney(null)}
                                        pendingDescription="Máximo 10 MB"
                                        error={docErrors.attorney}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Row 2: images full width */}
                    <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-[11px] font-semibold text-text">Imágenes de la aeronave</h2>
                                <p className="text-xs text-[#666666] mt-1">
                                    Mínimo 1 imagen · Máximo {MAX_PHOTOS} · {MAX_PHOTO_MB} MB por imagen
                                </p>
                            </div>
                            {photoFiles.length > 0 && (
                                <span className="text-[11px] text-muted">{photoFiles.length} / {MAX_PHOTOS}</span>
                            )}
                        </div>

                        {photoFiles.length > 0 ? (
                            <div className="grid grid-cols-5 gap-3">
                                {photoFiles.map(({ file, preview }, i) => (
                                    <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-border bg-neutral/10">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={preview} alt={file.name} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(i)}
                                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold leading-none"
                                            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                                            aria-label="Quitar imagen"
                                        >
                                            ×
                                        </button>
                                        <div
                                            className="absolute bottom-0 left-0 right-0 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                                        >
                                            <p className="text-[10px] text-white truncate">{file.name}</p>
                                        </div>
                                    </div>
                                ))}
                                {photoFiles.length < MAX_PHOTOS && (
                                    <ImageUpload
                                        accept="image/png,image/jpeg,image/jpg"
                                        onUpload={addPhoto}
                                        aspectRatio="video"
                                        pendingTitle="Agregar"
                                        pendingDescription=""
                                    />
                                )}
                            </div>
                        ) : (
                            <ImageUpload
                                accept="image/png,image/jpeg,image/jpg"
                                onUpload={addPhoto}
                                pendingTitle="Arrastra imágenes aquí o haz clic para cargar"
                                pendingDescription="PNG, JPG (máximo 5 MB cada una)"
                                error={photoError}
                            />
                        )}

                        {photoError && (
                            <p className="text-xs" style={{ color: "var(--color-error)" }}>Debes subir al menos una imagen de la aeronave</p>
                        )}
                        <p className="text-[11px] text-[#666666]">Estas imágenes serán visibles para Mobius durante la validación</p>
                    </div>
                </div>
            </form>
        </div>
    );
}
