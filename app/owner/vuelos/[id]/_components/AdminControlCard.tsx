"use client";

import React from "react";
import { Button } from "@/components/atoms/Button";
import { Download } from "lucide-react";

export interface Passenger {
  id: string;
  name: string;
  document: string;
}

export interface AdminControlCardProps {
  totalSeats: number;
  soldSeats: number;
  availableSeats: number;
  pricePerSeat: string;
  passengers: Passenger[];
  onMarkInFlight: () => void;
  onEditFlight: () => void;
  onDownloadManifest: () => void;
}

export const AdminControlCard: React.FC<AdminControlCardProps> = ({
  totalSeats,
  soldSeats,
  availableSeats,
  pricePerSeat,
  passengers,
  onMarkInFlight,
  onEditFlight,
  onDownloadManifest,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Occupancy Summary Section */}
      <div className="px-6 py-6 border-b border-border">
        <h3 className="text-[13px] font-semibold text-text mb-4">Resumen de ocupación</h3>

        {/* Summary Grid */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 bg-[#FAFAFA] rounded-md p-4 flex flex-col gap-1">
            <span className="text-[28px] font-medium text-text">{totalSeats}</span>
            <span className="text-[11px] font-medium text-muted">Asientos totales</span>
          </div>
          <div className="flex-1 bg-[#FAFAFA] rounded-md p-4 flex flex-col gap-1">
            <span className="text-[28px] font-medium text-[#2E7D32]">{soldSeats}</span>
            <span className="text-[11px] font-medium text-muted">Vendidos</span>
          </div>
          <div className="flex-1 bg-[#FAFAFA] rounded-md p-4 flex flex-col gap-1">
            <span className="text-[28px] font-medium text-text">{availableSeats}</span>
            <span className="text-[11px] font-medium text-muted">Disponibles</span>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-[#FAFAFA] rounded-md px-4 py-3 flex items-center justify-between">
          <span className="text-[13px] text-[#666666]">Precio por asiento</span>
          <span className="text-[15px] font-semibold text-text">{pricePerSeat}</span>
        </div>
      </div>

      {/* Passengers Section */}
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-semibold text-text">Pasajeros</h3>
          <div className="bg-[#F5F5F5] rounded px-2 py-1">
            <span className="text-[11px] font-medium text-[#666666]">
              {soldSeats} de {totalSeats}
            </span>
          </div>
        </div>

        {/* Passengers List */}
        <div className="flex flex-col">
          {passengers.map((passenger, index) => (
            <div
              key={passenger.id}
              className={`flex items-center justify-between py-3 ${
                index < passengers.length - 1 ? "border-b border-[#F0F0F0]" : ""
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-medium text-text">{passenger.name}</span>
                <span className="text-[11px] text-muted">{passenger.document}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Download Link */}
        <Button
          onClick={onDownloadManifest}
          variant="ghost"
          className="flex items-center justify-center gap-1.5 w-full pt-3 h-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Descargar manifiesto PDF</span>
        </Button>
      </div>

      {/* Actions Section */}
      <div className="px-6 py-6">
        <h3 className="text-[13px] font-semibold text-text mb-4">Acciones</h3>

        <div className="flex flex-col gap-4">
          {/* Primary CTA */}
          <Button
            onClick={onMarkInFlight}
            variant="primary"
            className="w-full h-12"
          >
            Marcar como En vuelo
          </Button>

          {/* Secondary CTA */}
          <Button
            onClick={onEditFlight}
            variant="outline"
            className="w-full h-12"
          >
            Editar vuelo
          </Button>
        </div>
      </div>
    </div>
  );
};
