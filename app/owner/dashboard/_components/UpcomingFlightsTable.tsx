"use client";

import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/molecules/Table";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { ArrowRight } from "lucide-react";

export interface FlightRow {
  id: string;
  route: string;
  date: string;
  aircraft: string;
  type: "charter" | "personal";
  status: "scheduled" | "in-flight" | "confirmed";
  capacity: string;
}

export interface UpcomingFlightsTableProps {
  flights: FlightRow[];
  onViewAll?: () => void;
}

const statusConfig = {
  scheduled: { label: "Programado", status: "pending" as const },
  "in-flight": { label: "En vuelo", status: "info" as const },
  confirmed: { label: "Confirmado", status: "success" as const },
};

const typeConfig = {
  charter: { label: "Charter", color: "#F5F5F5", textColor: "#666666" },
  personal: { label: "Personal", color: "#E8F5E9", textColor: "#2E7D32" },
};

export const UpcomingFlightsTable: React.FC<UpcomingFlightsTableProps> = ({
  flights,
  onViewAll,
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-h3 font-semibold text-text">Vuelos próximos</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-small font-medium text-muted hover:text-text transition-colors"
          >
            Ver todos
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableHead width={220}>Destino</TableHead>
          <TableHead width={140}>Fecha</TableHead>
          <TableHead width={140}>Aeronave</TableHead>
          <TableHead width={100}>Tipo</TableHead>
          <TableHead width={120}>Estado</TableHead>
          <TableHead style={{ flex: 1 }}>Capacidad</TableHead>
        </TableHeader>
        <TableBody>
          {flights.map((flight, index) => (
            <TableRow key={flight.id} isLast={index === flights.length - 1}>
              <TableCell width={220} variant="emphasis">
                {flight.route}
              </TableCell>
              <TableCell width={140}>{flight.date}</TableCell>
              <TableCell width={140}>{flight.aircraft}</TableCell>
              <TableCell width={100}>
                <span
                  className="inline-block px-2 py-1 rounded text-caption font-medium"
                  style={{
                    backgroundColor: typeConfig[flight.type].color,
                    color: typeConfig[flight.type].textColor,
                  }}
                >
                  {typeConfig[flight.type].label}
                </span>
              </TableCell>
              <TableCell width={120}>
                <StatusBadge status={statusConfig[flight.status].status}>
                  {statusConfig[flight.status].label}
                </StatusBadge>
              </TableCell>
              <TableCell style={{ flex: 1 }} variant="emphasis">
                {flight.capacity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
