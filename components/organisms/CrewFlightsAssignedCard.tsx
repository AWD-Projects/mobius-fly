import React from 'react';
import { StatusBadge, type StatusBadgeVariant } from '../molecules/StatusBadge';
import {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../molecules/Table';

export interface FlightRow {
  route: string;
  date: string;
  aircraft: string;
  status: string;
  statusVariant: 'confirmed' | 'pending' | 'cancelled';
}

export interface CrewFlightsAssignedCardProps {
  /** Card title */
  title?: string;
  /** Array of flight rows */
  flights: FlightRow[];
}

const statusVariantMap: Record<FlightRow['statusVariant'], StatusBadgeVariant> = {
  confirmed: 'active',
  pending: 'pending',
  cancelled: 'rejected',
};

export const CrewFlightsAssignedCard: React.FC<CrewFlightsAssignedCardProps> = ({
  title = 'Vuelos asignados',
  flights,
}) => {
  return (
    <div className="w-full bg-surface rounded-md border border-border flex flex-col">
      <div className="px-6 py-5">
        <h3 className="text-text text-small font-semibold">{title}</h3>
      </div>

      <TableHeader>
        <TableHead className="flex-1">Ruta</TableHead>
        <TableHead className="flex-1">Fecha</TableHead>
        <TableHead className="flex-1">Aeronave</TableHead>
        <TableHead className="flex-1">Estado</TableHead>
      </TableHeader>

      <TableBody>
        {flights.map((flight, index) => (
          <TableRow key={index} isLast={index === flights.length - 1}>
            <TableCell variant="emphasis" className="flex-1">{flight.route}</TableCell>
            <TableCell className="flex-1">{flight.date}</TableCell>
            <TableCell className="flex-1">{flight.aircraft}</TableCell>
            <TableCell className="flex-1">
              <StatusBadge status={statusVariantMap[flight.statusVariant]}>
                {flight.status}
              </StatusBadge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </div>
  );
};
