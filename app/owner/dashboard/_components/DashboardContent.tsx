"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { KpiCard } from "@/components/organisms/KpiCard";
import { AttentionSectionCard } from "@/components/organisms/AttentionSectionCard";
import { UpcomingFlightsTable } from "./UpcomingFlightsTable";
import { Plane, Users, Clock, DollarSign, FileText, Settings, type LucideIcon } from "lucide-react";
import { AlertBox } from "@/components/molecules/AlertBox";
import type { OwnerDashboardData } from "@/app/actions/dashboard";

interface Props {
    data:           OwnerDashboardData;
    firstName:      string | null;
    documentStatus: string | null;
}

function formatRevenue(amount: number): string {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000)     return `$${(amount / 1_000).toFixed(1)}K`;
    return amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export function DashboardContent({ data, firstName, documentStatus }: Props) {
    const router = useRouter();

    const kpiData = [
        {
            icon:            Plane,
            value:           String(data.kpis.activeFlights),
            title:           "Vuelos activos",
            subtitle:        "Programados y en curso",
            variant:         "dark" as const,
        },
        {
            icon:            Plane,
            value:           String(data.kpis.activeAircraft),
            title:           "Aeronaves disponibles",
            subtitle:        "Operativas",
            variant:         "secondary" as const,
            backgroundColor: "#FFFFFF",
        },
        {
            icon:            Users,
            value:           String(data.kpis.activeCrew),
            title:           "Tripulación activa",
            subtitle:        "Listos para volar",
            variant:         "secondary" as const,
            backgroundColor: "#FFFFFF",
        },
        {
            icon:            Clock,
            value:           String(data.kpis.pendingDocs),
            title:           "Docs. pendientes",
            subtitle:        "Requieren revisión",
            variant:         "secondary" as const,
            backgroundColor: "#FFFFFF",
        },
        {
            icon:            DollarSign,
            value:           formatRevenue(data.kpis.monthlyRevenue),
            title:           "Ingresos del mes",
            subtitle:        "Asientos vendidos",
            variant:         "dark" as const,
        },
    ];

    // Build attention items + click handlers (parallel arrays, AttentionItem has no onClick)
    type AttentionEntry = { icon: LucideIcon; title: string; subtitle: string; iconColor: string };
    const attentionItems: AttentionEntry[] = [];
    const attentionHandlers: (() => void)[] = [];

    if (data.attention.pendingDocs > 0) {
        attentionItems.push({
            icon:      FileText,
            title:     "Documentación pendiente",
            subtitle:  `${data.attention.pendingDocs} doc${data.attention.pendingDocs > 1 ? "s" : ""} por revisar`,
            iconColor: "#F57F17",
        });
        attentionHandlers.push(() => router.push("/owner/aeronaves"));
    }

    if (data.attention.flightsWithoutCrew > 0) {
        attentionItems.push({
            icon:      Users,
            title:     "Vuelos sin tripulación",
            subtitle:  `${data.attention.flightsWithoutCrew} vuelo${data.attention.flightsWithoutCrew > 1 ? "s" : ""} sin asignar`,
            iconColor: "#F57F17",
        });
        attentionHandlers.push(() => router.push("/owner/vuelos"));
    }

    if (data.attention.maintenanceAircraft > 0) {
        attentionItems.push({
            icon:      Settings,
            title:     "Aeronaves en mantenimiento",
            subtitle:  `${data.attention.maintenanceAircraft} aeronave${data.attention.maintenanceAircraft > 1 ? "s" : ""} no disponible${data.attention.maintenanceAircraft > 1 ? "s" : ""}`,
            iconColor: "#999999",
        });
        attentionHandlers.push(() => router.push("/owner/aeronaves"));
    }

    const greeting = firstName ? `Hola, ${firstName}` : "Hola";

    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {documentStatus === "PENDING_REVIEW" && (
                <div className="px-12 pt-6">
                    <AlertBox
                        variant="pending"
                        title="Documento de identidad en revisión"
                        description="Nuestro equipo está validando tu documento. Te notificaremos cuando sea aprobado. Este proceso puede tomar hasta 48 horas hábiles."
                    />
                </div>
            )}

            {/* Welcome */}
            <div className="px-12 py-8 flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-h1 font-semibold text-text">{greeting}</h1>
                    <p className="text-body text-muted">Resumen operativo de tu flota</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => router.push("/owner/vuelos/nuevo")}
                        variant="outline"
                        className="px-4 h-10 flex items-center gap-2"
                    >
                        <Plane className="w-4 h-4" />
                        Nuevo vuelo
                    </Button>
                    <Button
                        onClick={() => router.push("/owner/aeronaves/nuevo")}
                        variant="outline"
                        className="px-4 h-10 flex items-center gap-2"
                    >
                        <Plane className="w-4 h-4" />
                        Agregar aeronave
                    </Button>
                    <Button
                        onClick={() => router.push("/owner/tripulacion/nuevo")}
                        variant="outline"
                        className="px-4 h-10 flex items-center gap-2"
                    >
                        <Users className="w-4 h-4" />
                        Agregar tripulación
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="px-12 pb-8 flex items-stretch gap-4 overflow-x-auto">
                {kpiData.map((kpi, i) => (
                    <KpiCard key={i} {...kpi} />
                ))}
            </div>

            {/* Main */}
            <div className="px-12 py-8 flex gap-8">
                <div className="flex-1">
                    <UpcomingFlightsTable
                        flights={data.upcomingFlights}
                        onViewAll={() => router.push("/owner/vuelos")}
                    />
                </div>

                <div className="w-[340px] flex-shrink-0">
                    {attentionItems.length > 0 ? (
                        <AttentionSectionCard
                            title="Requiere atención"
                            items={attentionItems}
                            onItemClick={(index) => attentionHandlers[index]?.()}
                        />
                    ) : (
                        <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-2">
                            <h3 className="text-[13px] font-semibold text-text">Todo en orden</h3>
                            <p className="text-[12px] text-muted">No hay elementos que requieran atención en este momento.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
