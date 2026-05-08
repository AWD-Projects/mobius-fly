"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InputGroup } from "@/components/molecules/InputGroup";
import { SelectGroup } from "@/components/molecules/SelectGroup";
import { ImageUpload } from "@/components/molecules/ImageUpload";
import { DocumentUpload } from "@/components/molecules/DocumentUpload";

interface AircraftFormData {
  model: string;
  registration: string;
  year: string;
  seats: string;
  baseAirport: string;
  images: File[];
  proofOfOwnership: File | null;
  permits: File | null;
  powerOfAttorney: File | null;
}

export default function AddAircraftPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<AircraftFormData>({
    model: "",
    registration: "",
    year: "",
    seats: "",
    baseAirport: "",
    images: [],
    proofOfOwnership: null,
    permits: null,
    powerOfAttorney: null,
  });

  const handleBack = () => {
    router.push("/owner/aeronaves");
  };

  const handleSave = () => {
    console.log("Saving aircraft:", formData);
    // Aquí iría la lógica para guardar la aeronave
    router.push("/owner/aeronaves");
  };

  const handleCancel = () => {
    router.push("/owner/aeronaves");
  };

  return (
    <div className="w-full bg-[#f6f6f4] min-h-screen">
      {/* Header Section */}
      <div className="px-12 py-8">
        <Button
          onClick={handleBack}
          variant="link"
          className="flex items-center gap-3 mb-5 p-0 text-sm font-medium text-text hover:opacity-70"
        >
          <ArrowLeft className="w-6 h-6" />
          Volver a aeronaves
        </Button>

        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-semibold text-text">Agregar aeronave</h1>
          <p className="text-sm text-[#666666]">
            Registra una nueva aeronave para tu flota
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 pb-8 flex flex-col gap-7">
        {/* General Information Section */}
        <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
          <h2 className="text-[11px] font-semibold text-text">Información general</h2>

          <div className="flex flex-col gap-4">
            <InputGroup
              label="Modelo de la aeronave"
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="p. ej. Cessna 208B Grand Caravan"
            />

            <InputGroup
              label="Matrícula / Tail number"
              type="text"
              value={formData.registration}
              onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
              placeholder="p. ej. N2345XY"
            />

            <InputGroup
              label="Año del avión"
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="p. ej. 2020"
            />

            <InputGroup
              label="Número de asientos"
              type="text"
              value={formData.seats}
              onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
              placeholder="p. ej. 8"
            />

            <SelectGroup
              label="Aeropuerto base"
              value={formData.baseAirport}
              onChange={(e) => setFormData({ ...formData, baseAirport: e.target.value })}
            >
              <option value="" disabled className="text-[#CCCCCC]">
                Selecciona un aeropuerto
              </option>
              <option value="madrid">Madrid (MAD)</option>
              <option value="barcelona">Barcelona (BCN)</option>
              <option value="sevilla">Sevilla (SVQ)</option>
              <option value="malaga">Málaga (AGP)</option>
              <option value="valencia">Valencia (VLC)</option>
            </SelectGroup>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
          <h2 className="text-[11px] font-semibold text-text">Imágenes de la aeronave</h2>
          <p className="text-xs text-[#666666]">
            Sube múltiples fotografías de tu aeronave
          </p>

          <ImageUpload
            accept="image/png,image/jpeg,image/jpg"
            onUpload={(file: File) => {
              setFormData((prev) => ({ ...prev, images: [...prev.images, file] }));
            }}
            pendingTitle="Arrastra imágenes aquí o haz clic para cargar"
            pendingDescription="PNG, JPG (máximo 5 MB cada una)"
          />

          <p className="text-[11px] text-[#666666]">
            Estas imágenes serán visibles para Mobius durante la validación
          </p>
        </div>

        {/* Documentation Section */}
        <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
          <h2 className="text-[11px] font-semibold text-text">Documentación obligatoria</h2>

          <div className="flex flex-col gap-4">
            <p className="text-[11px] text-[#666666]">
              Todos los documentos serán revisados manualmente por Mobius Fly
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">Proof of ownership</label>
              <DocumentUpload
                accept=".pdf"
                onUpload={(file: File) => setFormData({ ...formData, proofOfOwnership: file })}
                pendingDescription="Máximo 10 MB"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">Permisos AFAC / DGAC</label>
              <DocumentUpload
                accept=".pdf"
                onUpload={(file: File) => setFormData({ ...formData, permits: file })}
                pendingDescription="Máximo 10 MB"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">Carta poder notariada</label>
              <DocumentUpload
                accept=".pdf"
                onUpload={(file: File) => setFormData({ ...formData, powerOfAttorney: file })}
                pendingDescription="Máximo 10 MB"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-8">
          <Button
            onClick={handleSave}
            variant="primary"
            className="w-60 h-10"
          >
            Guardar aeronave
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="w-60 h-10"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
