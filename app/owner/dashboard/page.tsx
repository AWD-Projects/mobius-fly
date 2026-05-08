"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { KpiCard } from "@/components/organisms/KpiCard";
import { AttentionSectionCard } from "@/components/organisms/AttentionSectionCard";
import { UpcomingFlightsTable } from "./_components/UpcomingFlightsTable";
import { Plane, Users, Clock, DollarSign, FileText } from "lucide-react";

// Mock data - en producción esto vendría de una API
const kpiData = [
  {
    icon: Plane,
    value: "7",
    title: "Vuelos activos",
    subtitle: "↑ 12% vs mes anterior",
    variant: "dark" as const,
  },
  {
    icon: Plane,
    value: "3",
    title: "Aeronaves disponibles",
    subtitle: "100% operativas",
    variant: "secondary" as const,
    backgroundColor: "#FFFFFF",
  },
  {
    icon: Users,
    value: "12",
    title: "Tripulación aprobada",
    subtitle: "Listos para volar",
    variant: "secondary" as const,
    backgroundColor: "#FFFFFF",
  },
  {
    icon: Clock,
    value: "2",
    title: "Pendientes de revisión",
    subtitle: "Requieren aprobación",
    variant: "secondary" as const,
    backgroundColor: "#FFFFFF",
  },
  {
    icon: DollarSign,
    value: "$84.2K",
    title: "Ingresos del mes",
    subtitle: "↑ 8% vs mes anterior",
    variant: "dark" as const,
  },
];

const upcomingFlights = [
  {
    id: "1",
    route: "Madrid → Ibiza",
    date: "14 Feb · 10:30",
    aircraft: "Citation CJ3+",
    type: "charter" as const,
    status: "scheduled" as const,
    capacity: "4/8",
  },
  {
    id: "2",
    route: "Barcelona → París",
    date: "14 Feb · 14:00",
    aircraft: "Phenom 300",
    type: "personal" as const,
    status: "in-flight" as const,
    capacity: "6/8",
  },
  {
    id: "3",
    route: "Málaga → Londres",
    date: "15 Feb · 08:00",
    aircraft: "Legacy 500",
    type: "charter" as const,
    status: "scheduled" as const,
    capacity: "8/12",
  },
  {
    id: "4",
    route: "Valencia → Milán",
    date: "15 Feb · 11:30",
    aircraft: "Citation CJ3+",
    type: "personal" as const,
    status: "confirmed" as const,
    capacity: "5/8",
  },
  {
    id: "5",
    route: "Sevilla → Ginebra",
    date: "16 Feb · 09:00",
    aircraft: "Phenom 300",
    type: "charter" as const,
    status: "scheduled" as const,
    capacity: "3/8",
  },
];

const attentionItems = [
  {
    icon: FileText,
    title: "Documentación incompleta",
    subtitle: "2 vuelos pendientes",
    iconColor: "#F57F17",
  },
  {
    icon: Clock,
    title: "Vuelos en revisión",
    subtitle: "2 pendientes de aprobación",
    iconColor: "#F57F17",
  },
  {
    icon: Users,
    title: "Aeronaves sin tripulación",
    subtitle: "1 aeronave sin asignar",
    iconColor: "#999999",
  },
];

export default function OwnerDashboardPage() {
  const router = useRouter();

  const handleNewFlight = () => {
    router.push("/owner/vuelos/nuevo");
  };

  const handleNewAircraft = () => {
    router.push("/owner/aeronaves/nuevo");
  };

  const handleNewCrew = () => {
    router.push("/owner/tripulacion/nuevo");
  };

  return (
    <div className="w-full bg-[#f6f6f4] min-h-screen">
      {/* Welcome Section */}
      <div className="px-12 py-8 flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-h1 font-semibold text-text">Hola, Eduardo</h1>
          <p className="text-body text-muted">Resumen operativo de tu flota</p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleNewFlight}
            variant="outline"
            className="px-4 h-10 flex items-center gap-2"
          >
            <Plane className="w-4 h-4" />
            Nuevo vuelo
          </Button>
          <Button
            onClick={handleNewAircraft}
            variant="outline"
            className="px-4 h-10 flex items-center gap-2"
          >
            <Plane className="w-4 h-4" />
            Agregar aeronave
          </Button>
          <Button
            onClick={handleNewCrew}
            variant="outline"
            className="px-4 h-10 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Agregar tripulación
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="px-12 pb-8 flex items-stretch gap-4 overflow-x-auto">
        {kpiData.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Content */}
      <div className="px-12 py-8 flex gap-8">
        {/* Left Content - Flights Table */}
        <div className="flex-1">
          <UpcomingFlightsTable
            flights={upcomingFlights}
            onViewAll={() => router.push("/owner/vuelos")}
          />
        </div>

        {/* Right Sidebar - Attention Section */}
        <div className="w-[340px] flex-shrink-0">
          <AttentionSectionCard
            title="Requiere atención"
            items={attentionItems}
            onItemClick={(index) => console.log("Clicked item:", index)}
          />
        </div>
      </div>
    </div>
  );
}
