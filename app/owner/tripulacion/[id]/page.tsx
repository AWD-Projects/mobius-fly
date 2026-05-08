"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { StatusBadge } from "@/components/molecules/StatusBadge";

interface AssignedFlight {
  id: string;
  route: string;
  date: string;
  aircraft: string;
  status: "confirmed" | "scheduled" | "in-flight";
}

interface Document {
  id: string;
  name: string;
  status: "validated" | "pending" | "rejected";
}

interface CrewMemberDetail {
  id: string;
  name: string;
  fullName: string;
  role: string;
  status: "active" | "inactive";
  licenseNumber: string;
  base: string;
  activeFlights: number;
  lastAssignment: string;
  assignedFlights: AssignedFlight[];
  documents: Document[];
}

// Mock data
const mockCrewData: Record<string, CrewMemberDetail> = {
  "1": {
    id: "1",
    name: "Carlos Pérez",
    fullName: "Carlos Pérez García",
    role: "Capitán / Piloto",
    status: "active",
    licenseNumber: "WKF53453",
    base: "Madrid",
    activeFlights: 2,
    lastAssignment: "15 feb 2026",
    assignedFlights: [
      {
        id: "1",
        route: "MAD → BCN",
        date: "15 Dic, 08:30",
        aircraft: "EC-ABD",
        status: "confirmed",
      },
      {
        id: "2",
        route: "BCN → SVQ",
        date: "15 Dic, 12:15",
        aircraft: "EC-ABE",
        status: "confirmed",
      },
    ],
    documents: [
      { id: "1", name: "Licencia de piloto", status: "validated" },
      { id: "2", name: "Identificación", status: "rejected" },
    ],
  },
};

const flightStatusConfig = {
  confirmed: { label: "Confirmado", status: "success" as const },
  scheduled: { label: "Programado", status: "pending" as const },
  "in-flight": { label: "En vuelo", status: "info" as const },
};

const docStatusConfig = {
  validated: { label: "Validado", color: "#E8F5E9", textColor: "#2E7D32" },
  pending: { label: "Pendiente", color: "#FFF8E1", textColor: "#F57F17" },
  rejected: { label: "Rechazado", color: "#FFEBEE", textColor: "#C62828" },
};

export default function CrewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const crewId = params.id as string;

  const crew = mockCrewData[crewId];

  if (!crew) {
    return (
      <div className="w-full min-h-screen bg-[#f6f6f4] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-text mb-2">Tripulante no encontrado</h1>
          <p className="text-sm text-muted">El tripulante que buscas no existe</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleMarkUnavailable = () => {
    console.log("Mark as unavailable:", crewId);
  };

  const handleEdit = () => {
    router.push(`/owner/tripulacion/${crewId}/edit`);
  };

  return (
    <div className="w-full bg-[#f6f6f4] min-h-screen">
      {/* Header Section */}
      <div className="px-12 py-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            {/* Avatar + Name */}
            <div className="flex items-center gap-3">
              <div className="w-[72px] h-[72px] rounded-full bg-[#E3F2FD] flex items-center justify-center">
                <span className="text-lg font-semibold text-info">{getInitials(crew.name)}</span>
              </div>
              <h1 className="text-[26px] font-semibold text-text">{crew.name}</h1>
            </div>

            {/* Role + Status */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#666666]">{crew.role}</span>
              <StatusBadge status={crew.status === "active" ? "success" : "inactive"}>
                {crew.status === "active" ? "Activo" : "Inactivo"}
              </StatusBadge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 pb-10 flex gap-8">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Information Card */}
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
            <h2 className="text-[13px] font-semibold text-text">Información del tripulante</h2>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#666666]">Nombre completo</span>
              <span className="text-xs font-medium text-text">{crew.fullName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#666666]">Rol</span>
              <span className="text-xs font-medium text-text">{crew.role}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#666666]">No. Licencia</span>
              <span className="text-xs font-medium text-text">{crew.licenseNumber}</span>
            </div>
          </div>

          {/* Assigned Flights Card */}
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
            {/* Title */}
            <h2 className="text-sm font-semibold text-text">Vuelos asignados</h2>

            {/* Table Header */}
            <div className="bg-[#FAFAFA] px-6 py-3.5 border-b border-border flex items-center">
              <div className="flex-1">
                <span className="text-xs font-medium text-[#666666]">Ruta</span>
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-[#666666]">Fecha</span>
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-[#666666]">Aeronave</span>
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-[#666666]">Estado</span>
              </div>
            </div>

            {/* Table Rows */}
            {crew.assignedFlights.map((flight, index) => (
              <div
                key={flight.id}
                className={`flex items-center px-6 py-[18px] ${
                  index < crew.assignedFlights.length - 1 ? "border-b border-[#F0F0F0]" : ""
                }`}
              >
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-[13px] font-medium text-text">{flight.route}</span>
                </div>
                <div className="flex-1">
                  <span className="text-[13px] text-[#666666]">{flight.date}</span>
                </div>
                <div className="flex-1">
                  <span className="text-[13px] text-[#666666]">{flight.aircraft}</span>
                </div>
                <div className="flex-1">
                  <StatusBadge status={flightStatusConfig[flight.status].status}>
                    {flightStatusConfig[flight.status].label}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-80 flex flex-col gap-6">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3.5">
            <h2 className="text-[13px] font-semibold text-text">Resumen</h2>

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#999999]">Rol</span>
              <span className="text-[11px] font-semibold text-text text-right">Capitán</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#999999]">Base</span>
              <span className="text-[11px] font-semibold text-text text-right">{crew.base}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#999999]">Vuelos activos</span>
              <span className="text-[11px] font-semibold text-text text-right">
                {crew.activeFlights}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#999999]">Última asignación</span>
              <span className="text-[11px] font-semibold text-text text-right">
                {crew.lastAssignment}
              </span>
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3.5">
            <h2 className="text-[13px] font-semibold text-text">Documentación</h2>

            {crew.documents.map((doc, index) => (
              <div
                key={doc.id}
                className={`flex flex-col gap-2 py-3 ${
                  index < crew.documents.length - 1 ? "border-b border-[#F0F0F0]" : ""
                }`}
              >
                <span className="text-[11px] font-medium text-text">{doc.name}</span>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded inline-flex items-center gap-1.5 w-fit"
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
            ))}
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3">
            <h2 className="text-[13px] font-semibold text-text">Acciones</h2>

            <button
              onClick={handleMarkUnavailable}
              className="w-full h-10 rounded-xl bg-text text-white text-xs font-medium hover:bg-text/90 transition-colors"
            >
              Marcar como No disponible
            </button>

            <button
              onClick={handleEdit}
              className="w-full h-10 rounded-xl border border-border text-xs font-medium text-[#666666] hover:bg-neutral/5 transition-colors"
            >
              Editar tripulante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
