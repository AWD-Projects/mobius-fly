"use client";

import React from "react";
import { Repeat, CircleDot, MapPin, Building2, Clock, FileText } from "lucide-react";

export interface FlightInfoCardProps {
  flightType: string;
  origin: {
    city: string;
    airport: string;
  };
  destination: {
    city: string;
    airport: string;
  };
  fbo: {
    name: string;
    location: string;
  };
  schedule: {
    time: string;
    duration: string;
  };
  flightPlanUrl?: string | null;
}

export const FlightInfoCard: React.FC<FlightInfoCardProps> = ({
  flightType,
  origin,
  destination,
  fbo,
  schedule,
  flightPlanUrl,
}) => {
  return (
    <div className="w-full">
      {/* Section Header */}
      <h2 className="text-[11px] font-semibold text-text mb-5">Datos del vuelo</h2>

      {/* Card */}
      <div className="w-full bg-white rounded-2xl border border-border p-7 flex flex-col gap-5">
        {/* Flight Type */}
        <div className="flex items-center gap-3">
          <Repeat className="w-4 h-4 text-muted" />
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-muted">Tipo de vuelo</span>
            <div className="px-2 py-1 rounded bg-[#F5F5F5]">
              <span className="text-[11px] font-medium text-text">{flightType}</span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-[#F0F0F0]" />

        {/* Origin & Destination */}
        <div className="flex items-start gap-8">
          {/* Origin */}
          <div className="flex-1 flex gap-3.5">
            <CircleDot className="w-[18px] h-[18px] text-muted flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Origen</span>
              <span className="text-[15px] font-medium text-text">{origin.city}</span>
              <span className="text-[13px] text-muted">{origin.airport}</span>
            </div>
          </div>

          {/* Destination */}
          <div className="flex-1 flex gap-3.5">
            <MapPin className="w-[18px] h-[18px] text-muted flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Destino</span>
              <span className="text-[15px] font-medium text-text">{destination.city}</span>
              <span className="text-[13px] text-muted">{destination.airport}</span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-[#F0F0F0]" />

        {/* FBO & Schedule */}
        <div className="flex items-start gap-8">
          {/* FBO */}
          <div className="flex-1 flex gap-3.5">
            <Building2 className="w-[18px] h-[18px] text-muted flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">FBO de salida</span>
              <span className="text-[15px] font-medium text-text">{fbo.name}</span>
              <span className="text-[13px] text-muted">{fbo.location}</span>
            </div>
          </div>

          {/* Schedule */}
          <div className="flex-1 flex gap-3.5">
            <Clock className="w-[18px] h-[18px] text-muted flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Horario</span>
              <span className="text-[15px] font-medium text-text">{schedule.time}</span>
              <span className="text-[13px] text-muted">{schedule.duration}</span>
            </div>
          </div>
        </div>

        {/* Flight Plan Download */}
        {flightPlanUrl && (
          <>
            <div className="w-full h-px bg-[#F0F0F0]" />
            <div className="flex items-center gap-3.5">
              <FileText className="w-[18px] h-[18px] text-muted flex-shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Plan de vuelo</span>
                <a
                  href={flightPlanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-medium text-text underline underline-offset-2 hover:opacity-70 transition-opacity w-fit"
                >
                  Descargar PDF
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
