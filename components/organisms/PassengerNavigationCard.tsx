import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../atoms/Button';

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
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-4">
      <h3 className="text-text text-body font-semibold">{title}</h3>

      {/* Adults Group */}
      <div className="flex flex-col gap-3">
        <span className="text-muted text-caption font-medium">{adults.title}</span>
        <div className="flex flex-col gap-3">
          {adults.passengers.map((passenger, index) => (
            <Button
              key={`adult-${index}`}
              variant="ghost"
              onClick={() => onPassengerClick?.('adult', index)}
              className={cn(
                "w-full h-11 px-3 gap-3 justify-start font-normal",
                passenger.isCompleted
                  ? "bg-background border-transparent hover:bg-background/80"
                  : "bg-surface border border-border hover:bg-neutral/20"
              )}
            >
              <div className={cn("w-2 h-2 rounded-full flex-shrink-0", passenger.isCompleted ? "bg-text" : "bg-neutral")} />
              <span className={cn("flex-1 text-left text-small", passenger.isCompleted ? "text-text font-semibold" : "text-muted font-normal")}>
                {passenger.label}
              </span>
              {passenger.isCompleted && <Check className="w-4 h-4 text-success flex-shrink-0" strokeWidth={1} />}
            </Button>
          ))}
        </div>
      </div>

      {/* Minors Group */}
      {minors.passengers.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-muted text-caption font-medium">{minors.title}</span>
          <div className="flex flex-col gap-3">
            {minors.passengers.map((passenger, index) => (
              <Button
                key={`minor-${index}`}
                variant="ghost"
                onClick={() => onPassengerClick?.('minor', index)}
                className="w-full h-11 px-3 gap-3 justify-start font-normal bg-surface border border-border hover:bg-neutral/20"
              >
                <div className="w-2 h-2 rounded-full bg-neutral flex-shrink-0" />
                <span className="flex-1 text-left text-small text-muted font-normal">{passenger.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
