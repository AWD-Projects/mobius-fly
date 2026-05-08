"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { Image } from "lucide-react";

interface AircraftDetail {
  id: string;
  name: string;
  registration: string;
  status: "available" | "maintenance" | "inactive";
  model: string;
  type: string;
  capacity: string;
  base: string;
  year: string;
  upcomingFlights: number;
  images: string[];
  documents: {
    id: string;
    name: string;
    status: "validated" | "under-review" | "rejected";
  }[];
}

// Mock data
const mockAircraftData: Record<string, AircraftDetail> = {
  "1": {
    id: "1",
    name: "Gulfstream G650",
    registration: "EC-MBX",
    status: "available",
    model: "Gulfstream G650",
    type: "Jet ligero-mediano",
    capacity: "14 pasajeros",
    base: "Madrid (MAD)",
    year: "2015",
    upcomingFlights: 4,
    images: [],
    documents: [
      { id: "1", name: "Certificado aeronavegabilidad", status: "validated" },
      { id: "2", name: "Póliza de seguro", status: "under-review" },
      { id: "3", name: "Registro de aeronave", status: "rejected" },
    ],
  },
};

const statusConfig = {
  available: { label: "Disponible", status: "success" as const },
  maintenance: { label: "Mantenimiento", status: "pending" as const },
  inactive: { label: "Inactivo", status: "inactive" as const },
};

const docStatusConfig = {
  validated: { label: "Validado", color: "#E8F5E9", textColor: "#2E7D32" },
  "under-review": { label: "En revisión", color: "#FFF3E0", textColor: "#E65100" },
  rejected: { label: "Rechazado", color: "#FFEBEE", textColor: "#C62828" },
};

export default function AircraftDetailPage() {
  const params = useParams();
  const router = useRouter();
  const aircraftId = params.id as string;

  const aircraft = mockAircraftData[aircraftId];

  if (!aircraft) {
    return (
      <div className="w-full min-h-screen bg-[#f6f6f4] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-text mb-2">Aeronave no encontrada</h1>
          <p className="text-sm text-muted">La aeronave que buscas no existe</p>
        </div>
      </div>
    );
  }

  const handleMarkMaintenance = () => {
    console.log("Mark as maintenance:", aircraftId);
  };

  const handleEdit = () => {
    router.push(`/owner/aeronaves/${aircraftId}/edit`);
  };

  const handleViewMore = () => {
    console.log("View more images");
  };

  return (
    <div className="w-full bg-[#f6f6f4] min-h-screen">
      {/* Header Section */}
      <div className="w-full bg-[#f6f6f4] px-12 py-8 border-b border-border">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-semibold text-text">{aircraft.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted">{aircraft.registration}</span>
              <StatusBadge status={statusConfig[aircraft.status].status}>
                {statusConfig[aircraft.status].label}
              </StatusBadge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 py-8 flex gap-8">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Aircraft Data Card */}
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-text">Datos de la aeronave</h2>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Modelo</span>
                <span className="text-[13px] font-medium text-text">{aircraft.model}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Matrícula</span>
                <span className="text-[13px] font-medium text-text">{aircraft.registration}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Tipo de aeronave</span>
                <span className="text-[13px] font-medium text-text">{aircraft.type}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Capacidad total</span>
                <span className="text-[13px] font-medium text-text">{aircraft.capacity}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Base</span>
                <span className="text-[13px] font-medium text-text">{aircraft.base}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Año de fabricación</span>
                <span className="text-[13px] font-medium text-text">{aircraft.year}</span>
              </div>
            </div>
          </div>

          {/* Images Card */}
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3">
            <div className="flex gap-3">
              {/* Placeholder images */}
              <div className="flex-1 h-32 bg-neutral/10 rounded-xl flex items-center justify-center">
                <Image className="w-8 h-8 text-muted/40" />
              </div>
              <div className="flex-1 h-32 bg-neutral/10 rounded-xl flex items-center justify-center">
                <Image className="w-8 h-8 text-muted/40" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 h-32 bg-neutral/10 rounded-xl flex items-center justify-center">
                <Image className="w-8 h-8 text-muted/40" />
              </div>
              <div className="flex-1 h-32 bg-neutral/10 rounded-xl flex items-center justify-center">
                <Image className="w-8 h-8 text-muted/40" />
              </div>
            </div>
            <Button
              onClick={handleViewMore}
              variant="outline"
              className="w-full h-10"
            >
              Ver más
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-80 flex flex-col gap-6">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-text">Resumen rápido</h2>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Capacidad</span>
                <span className="text-[13px] font-medium text-text">{aircraft.capacity}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Vuelos próximos</span>
                <span className="text-[13px] font-medium text-text">
                  {aircraft.upcomingFlights} vuelos
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Base actual</span>
                <span className="text-[13px] font-medium text-text">{aircraft.base}</span>
              </div>
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3">
            <h2 className="text-[13px] font-semibold text-text">Documentación</h2>

            {aircraft.documents.map((doc, index) => (
              <div
                key={doc.id}
                className={`flex flex-col gap-1.5 py-2.5 ${
                  index < aircraft.documents.length - 1 ? "border-b border-[#F0F0F0]" : ""
                }`}
              >
                <span className="text-[11px] font-medium text-text">{doc.name}</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[9px] font-medium px-1.5 py-0.5 rounded inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: docStatusConfig[doc.status].color,
                      color: docStatusConfig[doc.status].textColor,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: docStatusConfig[doc.status].textColor }}
                    />
                    {docStatusConfig[doc.status].label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-text">Acciones</h2>

            <Button
              onClick={handleMarkMaintenance}
              variant="primary"
              className="w-full h-10"
            >
              Marcar como mantenimiento
            </Button>

            <Button
              onClick={handleEdit}
              variant="outline"
              className="w-full h-10"
            >
              Editar aeronave
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
