"use client";

import React, { useState } from "react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";

interface Document {
  id: string;
  name: string;
  expiry: string;
  status: "uploaded" | "pending" | "expired";
}

export default function ProfilePage() {
  const [fleetName, setFleetName] = useState("Rodríguez Aviation Group");

  // Mock data
  const personalData = {
    fullName: "Juan Carlos Rodríguez",
    email: "juan.rodriguez@premium.aero",
    role: "Propietario / Admin",
    registrationDate: "12 Febrero 2023",
  };

  const documents: Document[] = [
    { id: "1", name: "INE / Cédula de identidad", expiry: "25 Mar 2032", status: "uploaded" },
    { id: "2", name: "Pasaporte", expiry: "18 Nov 2029", status: "uploaded" },
  ];

  const handleSaveFleetName = () => {
    console.log("Saving fleet name:", fleetName);
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
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#E8F5E9]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
            <span className="text-xs font-semibold text-[#2E7D32]">Verificado</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 pb-8 flex flex-col gap-6">
        {/* Fleet Name Section */}
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
          >
            Guardar cambios
          </Button>
        </div>

        {/* Personal Data Section */}
        <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-text">Datos personales</h2>

          <div className="flex flex-col">
            <div className="flex items-center justify-between py-3 border-b border-[#F0F0F0]">
              <span className="text-xs font-medium text-[#999999]">Nombre completo</span>
              <span className="text-[13px] font-semibold text-text">{personalData.fullName}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[#F0F0F0]">
              <span className="text-xs font-medium text-[#999999]">Correo electrónico</span>
              <span className="text-[13px] font-semibold text-text">{personalData.email}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[#F0F0F0]">
              <span className="text-xs font-medium text-[#999999]">Rol</span>
              <span className="text-[13px] font-semibold text-text">{personalData.role}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-xs font-medium text-[#999999]">Fecha de registro</span>
              <span className="text-[13px] font-semibold text-text">{personalData.registrationDate}</span>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-text">Documentos del propietario</h2>

          {/* Table */}
          <div className="w-full">
            {/* Header */}
            <div className="bg-[#FAFAFA] rounded-t-lg px-6 py-3.5 border-b border-border flex items-center">
              <div style={{ width: 200 }}>
                <span className="text-xs font-medium text-[#666666]">Documento</span>
              </div>
              <div style={{ flex: 1 }}>
                <span className="text-xs font-medium text-[#666666]">Vencimiento</span>
              </div>
              <div style={{ width: 120 }}>
                <span className="text-xs font-medium text-[#666666]">Estado</span>
              </div>
              <div style={{ width: 150 }}>
                <span className="text-xs font-medium text-[#666666]">Acción</span>
              </div>
            </div>

            {/* Rows */}
            {documents.map((doc, index) => (
              <div
                key={doc.id}
                className={`flex items-center px-6 py-[18px] ${
                  index < documents.length - 1 ? "border-b border-[#F0F0F0]" : ""
                }`}
              >
                <div style={{ width: 200 }}>
                  <span className="text-[13px] font-medium text-text">{doc.name}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <span className="text-[13px] text-[#666666]">{doc.expiry}</span>
                </div>
                <div style={{ width: 120 }}>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#E8F5E9]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                    <span className="text-xs font-medium text-[#2E7D32]">Cargado</span>
                  </div>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
