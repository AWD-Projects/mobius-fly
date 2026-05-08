"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InputGroup } from "@/components/molecules/InputGroup";
import { SelectGroup } from "@/components/molecules/SelectGroup";

// Mock data - en producción esto vendría de una API
const mockCrewData: Record<string, any> = {
  "1": {
    firstName: "Carlos",
    lastName: "Pérez García",
    role: "capitan",
    licenseNumber: "WKF53453",
    contactNumber: "+34 600 123 456",
  },
  "2": {
    firstName: "María",
    lastName: "García López",
    role: "copiloto",
    licenseNumber: "WKF53454",
    contactNumber: "+34 600 123 457",
  },
  "3": {
    firstName: "Juan",
    lastName: "López Martínez",
    role: "tcp",
    licenseNumber: "WKF53455",
    contactNumber: "+34 600 123 458",
  },
};

export default function EditCrewMemberPage() {
  const params = useParams();
  const router = useRouter();
  const crewId = params.id as string;

  // Load existing crew data or use defaults
  const existingCrew = mockCrewData[crewId] || {
    firstName: "",
    lastName: "",
    role: "",
    licenseNumber: "",
    contactNumber: "",
  };

  const [formData, setFormData] = useState(existingCrew);

  const handleBack = () => {
    router.push(`/owner/tripulacion/${crewId}`);
  };

  const handleUpdate = () => {
    console.log("Updating crew member:", crewId, formData);
    // Aquí iría la lógica para actualizar el tripulante
    router.push(`/owner/tripulacion/${crewId}`);
  };

  const handleCancel = () => {
    router.push(`/owner/tripulacion/${crewId}`);
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
          Volver al tripulante
        </Button>

        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-semibold text-text">Editar tripulante</h1>
          <p className="text-sm text-[#666666]">
            Modifica la información del miembro de tripulación
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
            onClick={handleUpdate}
            variant="primary"
            className="w-60 h-10"
          >
            Actualizar tripulante
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
