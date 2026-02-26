import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { NumericCounter } from '../molecules/NumericCounter';

export interface PricePassengerSelectorCardProps {
  /** Price per seat */
  pricePerSeat: string;
  /** Currency code */
  currency: string;
  /** Initial adults count */
  initialAdults?: number;
  /** Initial minors count */
  initialMinors?: number;
  /** Maximum passengers allowed */
  maxPassengers?: number;
  /** CTA button text */
  buttonText?: string;
  /** Button click handler with current counts */
  onContinue?: (adults: number, minors: number, total: string) => void;
}

export const PricePassengerSelectorCard: React.FC<PricePassengerSelectorCardProps> = ({
  pricePerSeat,
  currency,
  initialAdults = 2,
  initialMinors = 1,
  maxPassengers = 20,
  buttonText = 'Continuar',
  onContinue,
}) => {
  const [adults, setAdults] = useState(initialAdults);
  const [minors, setMinors] = useState(initialMinors);

  const priceNumeric = parseFloat(pricePerSeat.replace(/[^0-9.]/g, ''));
  const totalPassengers = adults + minors;
  const totalPrice = (priceNumeric * totalPassengers).toLocaleString('es-MX', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-5">
      {/* Price per seat */}
      <div className="flex flex-col gap-1">
        <span className="text-muted text-caption font-medium">Precio por asiento</span>
        <span className="text-text text-h3 font-bold">
          {pricePerSeat} {currency}
        </span>
      </div>

      <div className="w-full h-px bg-border" />

      <h4 className="text-text text-caption font-semibold">Pasajeros</h4>

      {/* Adults */}
      <NumericCounter
        label="Adultos"
        value={adults}
        onChange={setAdults}
        min={0}
        max={maxPassengers - minors}
      />

      {/* Minors */}
      <NumericCounter
        label="Menores"
        value={minors}
        onChange={setMinors}
        min={0}
        max={maxPassengers - adults}
      />

      <div className="w-full h-px bg-border" />

      {/* Total */}
      <div className="flex flex-col gap-1">
        <span className="text-muted text-caption font-medium">
          Total ({totalPassengers} asiento{totalPassengers !== 1 ? 's' : ''})
        </span>
        <span className="text-text text-h4 font-bold">
          ${totalPrice} {currency}
        </span>
      </div>

      <Button
        variant="secondary"
        size="md"
        onClick={() => onContinue?.(adults, minors, `$${totalPrice} ${currency}`)}
        className="w-full"
      >
        {buttonText}
      </Button>
    </div>
  );
};
