"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, File } from "lucide-react";

export default function AddAircraftPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    model: "",
    registration: "",
    year: "",
    seats: "",
    baseAirport: "",
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
        <button
          onClick={handleBack}
          className="flex items-center gap-3 mb-5 text-sm font-medium text-text hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6" />
          Volver a aeronaves
        </button>

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
            {/* Model */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">Modelo de la aeronave</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="p. ej. Cessna 208B Grand Caravan"
                className="h-10 px-3 rounded-lg border border-border bg-transparent text-xs placeholder:text-[#CCCCCC] outline-none focus:border-text transition-colors"
              />
            </div>

            {/* Registration */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">Matrícula / Tail number</label>
              <input
                type="text"
                value={formData.registration}
                onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                placeholder="p. ej. N2345XY"
                className="h-10 px-3 rounded-lg border border-border bg-transparent text-xs placeholder:text-[#CCCCCC] outline-none focus:border-text transition-colors"
              />
            </div>

            {/* Year */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">Año del avión</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="p. ej. 2020"
                className="h-10 px-3 rounded-lg border border-border bg-transparent text-xs placeholder:text-[#CCCCCC] outline-none focus:border-text transition-colors"
              />
            </div>

            {/* Seats */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">Número de asientos</label>
              <input
                type="text"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                placeholder="p. ej. 8"
                className="h-10 px-3 rounded-lg border border-border bg-transparent text-xs placeholder:text-[#CCCCCC] outline-none focus:border-text transition-colors"
              />
            </div>

            {/* Base Airport */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">Aeropuerto base</label>
              <select
                value={formData.baseAirport}
                onChange={(e) => setFormData({ ...formData, baseAirport: e.target.value })}
                className="h-10 px-3 rounded-lg border border-border bg-transparent text-xs text-text outline-none focus:border-text transition-colors"
              >
                <option value="" disabled className="text-[#CCCCCC]">
                  Selecciona un aeropuerto
                </option>
                <option value="madrid">Madrid (MAD)</option>
                <option value="barcelona">Barcelona (BCN)</option>
                <option value="sevilla">Sevilla (SVQ)</option>
                <option value="malaga">Málaga (AGP)</option>
                <option value="valencia">Valencia (VLC)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
          <h2 className="text-[11px] font-semibold text-text">Imágenes de la aeronave</h2>

          <div className="flex flex-col gap-3">
            <p className="text-xs text-[#666666]">
              Sube múltiples fotografías de tu aeronave
            </p>

            {/* Upload Area */}
            <div className="flex flex-col items-center justify-center gap-4 h-[120px] border-2 border-border rounded-xl bg-[#F9F9F7] cursor-pointer hover:bg-[#f5f5f3] transition-colors">
              <ImageIcon className="w-8 h-8 text-[#999999]" />
              <div className="flex flex-col items-center gap-1">
                <p className="text-[13px] font-medium text-text">
                  Arrastra imágenes aquí o haz clic para cargar
                </p>
                <p className="text-[11px] text-[#999999]">
                  PNG, JPG (máximo 5 MB cada una)
                </p>
              </div>
            </div>

            <p className="text-[11px] text-[#666666]">
              Estas imágenes serán visibles para Mobius durante la validación
            </p>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
          <h2 className="text-[11px] font-semibold text-text">Documentación obligatoria</h2>

          <div className="flex flex-col gap-4">
            <p className="text-[11px] text-[#666666]">
              Todos los documentos serán revisados manualmente por Mobius Fly
            </p>

            {/* Proof of Ownership */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">Proof of ownership</label>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center justify-center gap-4 h-[132px] border border-border rounded-xl bg-[#F9F9F7] cursor-pointer hover:bg-[#f5f5f3] transition-colors">
                  <File className="w-8 h-8 text-[#999999]" />
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[13px] font-medium text-text">
                      Arrastra un PDF aquí o haz clic para cargar
                    </p>
                    <p className="text-[11px] text-[#999999]">Máximo 10 MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Permits AFAC/DGAC */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">Permisos AFAC / DGAC</label>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center justify-center gap-4 h-[132px] border border-border rounded-xl bg-[#F9F9F7] cursor-pointer hover:bg-[#f5f5f3] transition-colors">
                  <File className="w-8 h-8 text-[#999999]" />
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[13px] font-medium text-text">
                      Arrastra un PDF aquí o haz clic para cargar
                    </p>
                    <p className="text-[11px] text-[#999999]">Máximo 10 MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Power of Attorney */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">Carta poder notariada</label>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center justify-center gap-4 h-[132px] border border-border rounded-xl bg-[#F9F9F7] cursor-pointer hover:bg-[#f5f5f3] transition-colors">
                  <File className="w-8 h-8 text-[#999999]" />
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[13px] font-medium text-text">
                      Arrastra un PDF aquí o haz clic para cargar
                    </p>
                    <p className="text-[11px] text-[#999999]">Máximo 10 MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-8">
          <button
            onClick={handleSave}
            className="w-60 h-10 rounded-xl bg-text text-white text-[13px] font-semibold hover:bg-text/90 transition-colors"
          >
            Guardar aeronave
          </button>
          <button
            onClick={handleCancel}
            className="w-60 h-10 rounded-xl bg-white border border-border text-[13px] font-semibold text-text hover:bg-neutral/5 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
