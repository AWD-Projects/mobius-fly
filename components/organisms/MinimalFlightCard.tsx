import React from 'react';
import { ArrowRight } from 'lucide-react';

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
  success: 'text-[#2E7D32]',
  warning: 'text-[#F57C00]',
  default: 'text-[#0A0A0A]',
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
      className={`w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-3 ${
        onClick ? 'cursor-pointer hover:border-gray-300 transition-colors' : ''
      }`}
      onClick={onClick}
    >
      {/* Route Row */}
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Origin */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-[#0A0A0A] text-2xl font-bold leading-tight">
            {originCode}
          </div>
          <div className="text-[#666666] text-xs font-normal">
            {originCity}
          </div>
        </div>

        {/* Arrow Icon */}
        <ArrowRight className="w-5 h-5 text-[#D0D0D0] flex-shrink-0" strokeWidth={1} />

        {/* Destination */}
        <div className="flex flex-col gap-1 flex-1 items-end">
          <div className="text-[#0A0A0A] text-2xl font-bold leading-tight">
            {destinationCode}
          </div>
          <div className="text-[#666666] text-xs font-normal">
            {destinationCity}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#F0F0F0]" />

      {/* Details Row */}
      <div className="flex items-start justify-between gap-6">
        {/* Date */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-[#999999] text-[11px] font-medium">Salida</div>
          <div className="text-[#0A0A0A] text-[13px] font-semibold">
            {departureDateTime}
          </div>
        </div>

        {/* Capacity */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-[#999999] text-[11px] font-medium">Disponible</div>
          <div className={`text-[13px] font-semibold ${capacityColorStyles[capacityColor]}`}>
            {capacity}
          </div>
        </div>

        {/* Flight Type */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-[#999999] text-[11px] font-medium">Tipo</div>
          <div className="inline-flex">
            <span className="bg-[#F5F5F5] rounded px-2 py-1 text-[#666666] text-[11px] font-medium">
              {flightType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
