import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../atoms/Button';

export interface FlightSummaryCardProps {
  /** Origin airport code */
  originCode: string;
  /** Destination airport code */
  destinationCode: string;
  /** Flight date (e.g., "Miercoles 15 de mayo, 2024") */
  date: string;
  /** Time range (e.g., "10:30 AM - 4:45 PM (5h 15m)") */
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
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-6">
      {/* Title */}
      <h3 className="text-text text-body font-semibold">
        Resumen de tu vuelo
      </h3>

      {/* Flight Info Section */}
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-center gap-2">
          <span className="text-text text-body font-bold">{originCode}</span>
          <ArrowRight className="w-4 h-4 text-muted" strokeWidth={1} />
          <span className="text-text text-body font-bold">{destinationCode}</span>
        </div>
        <div className="text-muted text-caption font-normal text-center">
          {date}
        </div>
        <div className="text-muted text-caption font-normal text-center">
          {timeRange}
        </div>
        <div className="flex justify-center">
          <span className="bg-background rounded-sm px-2 py-1 text-muted text-caption font-medium">
            {flightType}
          </span>
        </div>
      </div>

      {/* Passengers Section */}
      <div className="flex flex-col gap-3">
        <h4 className="text-text text-caption font-semibold">Pasajeros</h4>
        <div className="flex justify-between items-center">
          <span className="text-muted text-caption font-normal">Adultos</span>
          <span className="text-text text-caption font-semibold">{adultsCount}</span>
        </div>
        {minorsCount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-muted text-caption font-normal">Menores</span>
            <span className="text-text text-caption font-semibold">{minorsCount}</span>
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="flex flex-col gap-2">
        <h4 className="text-text text-caption font-semibold">Precio total</h4>
        <div className="flex items-baseline gap-1">
          <span className="text-text text-h3 font-bold leading-none">
            {priceValue}
          </span>
          <span className="text-muted text-caption font-medium">{currency}</span>
        </div>
        <div className="text-muted text-caption font-normal">
          por pasajero ({totalPassengers} total)
        </div>
      </div>

      {/* CTA Button */}
      <Button
        variant="secondary"
        size="lg"
        onClick={onContinue}
        className="w-full"
      >
        {buttonText}
      </Button>
    </div>
  );
};
