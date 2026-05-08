"use client";

import React from "react";
import { ArrowRight, Hash, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/molecules/StatusBadge";

export interface FlightDetailHeroProps {
  flightId: string;
  origin: string;
  destination: string;
  date: string;
  status: "scheduled" | "in-flight" | "confirmed" | "completed";
}

const statusConfig = {
  scheduled: { label: "Programado", status: "pending" as const },
  "in-flight": { label: "En vuelo", status: "info" as const },
  confirmed: { label: "Confirmado", status: "success" as const },
  completed: { label: "Completado", status: "inactive" as const },
};

export const FlightDetailHero: React.FC<FlightDetailHeroProps> = ({
  flightId,
  origin,
  destination,
  date,
  status,
}) => {
  return (
    <div className="w-full bg-[#f6f6f4] px-12 py-8 border-b border-border">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs text-[#999999]">Vuelos</span>
        <span className="text-xs text-[#CCCCCC]">/</span>
        <span className="text-xs font-medium text-text">{flightId}</span>
      </div>

      {/* Main Hero Content */}
      <div className="flex items-center justify-between">
        {/* Left: Route and Meta */}
        <div className="flex flex-col gap-3">
          {/* Route */}
          <div className="flex items-center gap-4">
            <h1 className="text-[40px] font-medium text-text" style={{ letterSpacing: "-0.5px" }}>
              {origin}
            </h1>
            <ArrowRight className="w-6 h-6 text-muted" />
            <h1 className="text-[40px] font-medium text-text" style={{ letterSpacing: "-0.5px" }}>
              {destination}
            </h1>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-muted" />
              <span className="text-sm text-[#666666]">{flightId}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted" />
              <span className="text-sm text-[#666666]">{date}</span>
            </div>
          </div>
        </div>

        {/* Right: Status Badge */}
        <div>
          <StatusBadge status={statusConfig[status].status}>
            {statusConfig[status].label}
          </StatusBadge>
        </div>
      </div>
    </div>
  );
};
