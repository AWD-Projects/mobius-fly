import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface FlightSummaryCardProps {
  /** Origin airport code */
  originCode: string;
  /** Destination airport code */
  destinationCode: string;
  /** Flight date (e.g., "Miércoles 15 de mayo, 2024") */
  date: string;
  /** Time range (e.g., "10:30 AM – 4:45 PM (5h 15m)") */
  timeRange: string;
  /** Flight type */
  flightType: string;
  /** Number of adults */
  adultsCount: number;
  /** Number of minors */
  minorsCount: number;
  /** Price value */
  priceValue: string;
  /** Currency code */
  currency: string;
  /** Total passengers count */
  totalPassengers: number;
  /** CTA button text */
  buttonText?: string;
  /** Button click handler */
  onContinue?: () => void;
}

export const FlightSummaryCard: React.FC<FlightSummaryCardProps> = ({
  originCode,
  destinationCode,
  date,
  timeRange,
  flightType,
  adultsCount,
  minorsCount,
  priceValue,
  currency,
  totalPassengers,
  buttonText = 'Continuar con el pago',
  onContinue,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-6">
      {/* Title */}
      <h3 className="text-[#0A0A0A] text-base font-semibold">
        Resumen de tu vuelo
      </h3>

      {/* Flight Info Section */}
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[#0A0A0A] text-base font-bold">{originCode}</span>
          <ArrowRight className="w-4 h-4 text-[#666666]" strokeWidth={2} />
          <span className="text-[#0A0A0A] text-base font-bold">{destinationCode}</span>
        </div>
        <div className="text-[#666666] text-xs font-normal text-center">
          {date}
        </div>
        <div className="text-[#666666] text-xs font-normal text-center">
          {timeRange}
        </div>
        <div className="flex justify-center">
          <span className="bg-[#F5F5F5] rounded px-2 py-1 text-[#666666] text-[11px] font-medium">
            {flightType}
          </span>
        </div>
      </div>

      {/* Passengers Section */}
      <div className="flex flex-col gap-3">
        <h4 className="text-[#0A0A0A] text-xs font-semibold">Pasajeros</h4>
        <div className="flex justify-between items-center">
          <span className="text-[#666666] text-xs font-normal">Adultos</span>
          <span className="text-[#0A0A0A] text-xs font-semibold">{adultsCount}</span>
        </div>
        {minorsCount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-[#666666] text-xs font-normal">Menores</span>
            <span className="text-[#0A0A0A] text-xs font-semibold">{minorsCount}</span>
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="flex flex-col gap-2">
        <h4 className="text-[#0A0A0A] text-xs font-semibold">Precio total</h4>
        <div className="flex items-baseline gap-1">
          <span className="text-[#0A0A0A] text-[28px] font-bold leading-none">
            {priceValue}
          </span>
          <span className="text-[#666666] text-xs font-medium">{currency}</span>
        </div>
        <div className="text-[#999999] text-[11px] font-normal">
          por pasajero ({totalPassengers} total)
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onContinue}
        className="w-full h-11 bg-[#0A0A0A] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1a1a1a] transition-colors shadow-sm flex items-center justify-center"
      >
        {buttonText}
      </button>
    </div>
  );
};
