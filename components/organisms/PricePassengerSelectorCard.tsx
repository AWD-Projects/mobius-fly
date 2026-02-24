import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

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

  const handleIncrement = (type: 'adults' | 'minors') => {
    if (totalPassengers >= maxPassengers) return;
    if (type === 'adults') setAdults(adults + 1);
    else setMinors(minors + 1);
  };

  const handleDecrement = (type: 'adults' | 'minors') => {
    if (type === 'adults' && adults > 0) setAdults(adults - 1);
    else if (type === 'minors' && minors > 0) setMinors(minors - 1);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-5">
      {/* Price per seat */}
      <div className="flex flex-col gap-1">
        <span className="text-[#999999] text-[11px] font-medium">
          Precio por asiento
        </span>
        <span className="text-[#0A0A0A] text-2xl font-bold">
          {pricePerSeat} {currency}
        </span>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#F0F0F0]" />

      {/* Passengers title */}
      <h4 className="text-[#0A0A0A] text-xs font-semibold">Pasajeros</h4>

      {/* Adults Section */}
      <div className="flex flex-col gap-2">
        <span className="text-[#999999] text-[11px] font-medium">Adultos</span>
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => handleDecrement('adults')}
            disabled={adults === 0}
            className="w-9 h-9 rounded-md bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-3.5 h-3.5 text-[#0A0A0A]" strokeWidth={1} />
          </button>
          <span className="text-[#0A0A0A] text-sm font-semibold">{adults}</span>
          <button
            onClick={() => handleIncrement('adults')}
            disabled={totalPassengers >= maxPassengers}
            className="w-9 h-9 rounded-md bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5 text-[#0A0A0A]" strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Minors Section */}
      <div className="flex flex-col gap-2">
        <span className="text-[#999999] text-[11px] font-medium">Menores</span>
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => handleDecrement('minors')}
            disabled={minors === 0}
            className="w-9 h-9 rounded-md bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-3.5 h-3.5 text-[#0A0A0A]" strokeWidth={1} />
          </button>
          <span className="text-[#0A0A0A] text-sm font-semibold">{minors}</span>
          <button
            onClick={() => handleIncrement('minors')}
            disabled={totalPassengers >= maxPassengers}
            className="w-9 h-9 rounded-md bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5 text-[#0A0A0A]" strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#F0F0F0]" />

      {/* Total */}
      <div className="flex flex-col gap-1">
        <span className="text-[#999999] text-[11px] font-medium">
          Total ({totalPassengers} asiento{totalPassengers !== 1 ? 's' : ''})
        </span>
        <span className="text-[#0A0A0A] text-xl font-bold">
          ${totalPrice} {currency}
        </span>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onContinue?.(adults, minors, `$${totalPrice} ${currency}`)}
        className="w-full h-10 bg-[#0A0A0A] text-white text-xs font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors shadow-sm flex items-center justify-center"
      >
        {buttonText}
      </button>
    </div>
  );
};
