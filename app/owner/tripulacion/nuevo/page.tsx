"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InputGroup } from "@/components/molecules/InputGroup";
import { SelectGroup } from "@/components/molecules/SelectGroup";

export default function AddCrewMemberPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    licenseNumber: "",
    contactNumber: "",
  });

  const handleBack = () => {
    router.push("/owner/tripulacion");
  };

  const handleSave = () => {
    console.log("Saving crew member:", formData);
    // Aquí iría la lógica para guardar el tripulante
    router.push("/owner/tripulacion");
  };

  const handleCancel = () => {
    router.push("/owner/tripulacion");
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
          Volver a tripulación
        </Button>

        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-semibold text-text">Agregar tripulante</h1>
          <p className="text-sm text-[#666666]">
            Registra a los miembros de tu tripulación para poder asignarlos a vuelos
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 pb-8 flex flex-col gap-7">
        {/* Crew Information Section */}
        <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
          <h2 className="text-[11px] font-semibold text-text">Información del tripulante</h2>

          <div className="flex flex-col gap-4">
            <InputGroup
              label="Nombre(s)"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="p. ej. Juan"
            />

            <InputGroup
              label="Apellido(s)"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="p. ej. Pérez García"
            />

            <SelectGroup
              label="Rol del tripulante"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              helperText="El rol define la disponibilidad del tripulante en diferentes tipos de vuelos"
            >
              <option value="" disabled className="text-[#CCCCCC]">
                Selecciona un rol
              </option>
              <option value="capitan">Capitán / Piloto</option>
              <option value="copiloto">Copiloto / Piloto</option>
              <option value="tcp">TCP / Sobrecargo</option>
              <option value="mecanico">Mecánico</option>
              <option value="asistente">Asistente de vuelo</option>
            </SelectGroup>

            <InputGroup
              label="Número de licencia"
              type="text"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              placeholder="p. ej. PEC-2023-45678"
            />

            <InputGroup
              label="Número de contacto"
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              placeholder="p. ej. +52 5566 7766 43"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-8">
          <Button
            onClick={handleSave}
            variant="primary"
            className="w-60 h-10"
          >
            Guardar tripulante
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
