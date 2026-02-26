import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TypeBadge } from '../atoms/TypeBadge';

export interface MinimalFlightCardProps {
  /** Origin airport code (e.g., "MAD") */
  originCode: string;
  /** Origin city name */
  originCity: string;
  /** Destination airport code (e.g., "JFK") */
  destinationCode: string;
  /** Destination city name */
  destinationCity: string;
  /** Departure date and time */
  departureDateTime: string;
  /** Available seats/capacity */
  capacity: string;
  /** Flight type (e.g., "Sencillo", "Redondo") */
  flightType: string;
  /** Optional capacity text color (e.g., for availability status) */
  capacityColor?: 'success' | 'warning' | 'default';
  /** Optional click handler */
  onClick?: () => void;
}

const capacityColorStyles = {
  success: 'text-success',
  warning: 'text-warning',
  default: 'text-text',
};

export const MinimalFlightCard: React.FC<MinimalFlightCardProps> = ({
  originCode,
  originCity,
  destinationCode,
  destinationCity,
  departureDateTime,
  capacity,
  flightType,
  capacityColor = 'success',
  onClick,
}) => {
  return (
    <div
      className={`w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-3 ${
        onClick ? 'cursor-pointer hover:border-neutral transition-colors' : ''
      }`}
      onClick={onClick}
    >
      {/* Route Row */}
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Origin */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-text text-h3 font-bold leading-tight">
            {originCode}
          </div>
          <div className="text-muted text-caption font-normal">
            {originCity}
          </div>
        </div>

        {/* Arrow Icon */}
        <ArrowRight className="w-5 h-5 text-neutral flex-shrink-0" strokeWidth={1} />

        {/* Destination */}
        <div className="flex flex-col gap-1 flex-1 items-end">
          <div className="text-text text-h3 font-bold leading-tight">
            {destinationCode}
          </div>
          <div className="text-muted text-caption font-normal">
            {destinationCity}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border" />

      {/* Details Row */}
      <div className="flex items-start justify-between gap-6">
        {/* Date */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-muted text-caption font-medium">Salida</div>
          <div className="text-text text-small font-semibold">
            {departureDateTime}
          </div>
        </div>

        {/* Capacity */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-muted text-caption font-medium">Disponible</div>
          <div className={`text-small font-semibold ${capacityColorStyles[capacityColor]}`}>
            {capacity}
          </div>
        </div>

        {/* Flight Type */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-muted text-caption font-medium">Tipo</div>
          <TypeBadge variant="neutral">{flightType}</TypeBadge>
        </div>
      </div>
    </div>
  );
};
