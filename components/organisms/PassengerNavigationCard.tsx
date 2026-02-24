import React from 'react';
import { Check } from 'lucide-react';

export interface Passenger {
  label: string;
  isCompleted: boolean;
}

export interface PassengerGroup {
  title: string;
  passengers: Passenger[];
}

export interface PassengerNavigationCardProps {
  /** Card title */
  title?: string;
  /** Adults group */
  adults: PassengerGroup;
  /** Minors group */
  minors: PassengerGroup;
  /** Passenger click handler */
  onPassengerClick?: (groupType: 'adult' | 'minor', index: number) => void;
}

export const PassengerNavigationCard: React.FC<PassengerNavigationCardProps> = ({
  title = 'Pasajeros',
  adults,
  minors,
  onPassengerClick,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4">
      {/* Title */}
      <h3 className="text-[#0A0A0A] text-base font-semibold">{title}</h3>

      {/* Adults Group */}
      <div className="flex flex-col gap-3">
        <span className="text-[#666666] text-xs font-medium">{adults.title}</span>
        <div className="flex flex-col gap-3">
          {adults.passengers.map((passenger, index) => (
            <button
              key={`adult-${index}`}
              onClick={() => onPassengerClick?.('adult', index)}
              className={`w-full h-11 rounded-lg px-3 flex items-center gap-3 transition-colors ${
                passenger.isCompleted
                  ? 'bg-[#F9F9F8]'
                  : 'bg-white border border-[#E5E5E5]'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  passenger.isCompleted ? 'bg-[#0A0A0A]' : 'bg-[#CCCCCC]'
                }`}
              />
              <span
                className={`flex-1 text-left text-[13px] ${
                  passenger.isCompleted
                    ? 'text-[#0A0A0A] font-semibold'
                    : 'text-[#999999] font-normal'
                }`}
              >
                {passenger.label}
              </span>
              {passenger.isCompleted && (
                <Check className="w-4 h-4 text-[#2E7D32]" strokeWidth={1} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Minors Group */}
      {minors.passengers.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-[#666666] text-xs font-medium">{minors.title}</span>
          <div className="flex flex-col gap-3">
            {minors.passengers.map((passenger, index) => (
              <button
                key={`minor-${index}`}
                onClick={() => onPassengerClick?.('minor', index)}
                className="w-full h-11 rounded-lg px-3 flex items-center gap-3 bg-white border border-[#E5E5E5]"
              >
                <div className="w-2 h-2 rounded-full bg-[#CCCCCC]" />
                <span className="flex-1 text-left text-[13px] text-[#999999] font-normal">
                  {passenger.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
