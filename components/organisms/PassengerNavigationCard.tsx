import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../atoms/Button';

export interface Passenger {
  label: string;
  isCompleted: boolean;
  isActive?: boolean;
  hasError?: boolean;
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

// ─── PassengerRow ─────────────────────────────────────────────────────────────

function passengerRowStyles(p: Passenger) {
  if (p.isActive) {
    return {
      button: "bg-surface border border-primary hover:bg-surface",
      dot: "bg-primary",
      label: "text-text font-semibold",
    };
  }
  if (p.isCompleted) {
    return {
      button: "bg-background border border-transparent hover:bg-background/80",
      dot: "bg-success",
      label: "text-text font-medium",
    };
  }
  if (p.hasError) {
    return {
      button: "bg-error/5 border border-error/40 hover:bg-error/10",
      dot: "bg-error",
      label: "text-error font-normal",
    };
  }
  return {
    button: "bg-surface border border-border hover:bg-neutral/20",
    dot: "bg-neutral",
    label: "text-muted font-normal",
  };
}

interface PassengerGroupProps {
  passengers: Passenger[];
  groupType: "adult" | "minor";
  title: string;
  onPassengerClick?: PassengerNavigationCardProps["onPassengerClick"];
}

function PassengerGroup({ passengers, groupType, title, onPassengerClick }: PassengerGroupProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-muted text-caption font-medium">{title}</span>
      <div className="flex flex-col gap-3">
        {passengers.map((passenger, index) => {
          const styles = passengerRowStyles(passenger);
          return (
            <Button
              key={`${groupType}-${index}`}
              variant="ghost"
              onClick={() => onPassengerClick?.(groupType, index)}
              className={cn("w-full h-11 px-3 gap-3 justify-start font-normal", styles.button)}
            >
              <div className={cn("w-2 h-2 rounded-full flex-shrink-0", styles.dot)} />
              <span className={cn("flex-1 text-left text-small", styles.label)}>
                {passenger.label}
              </span>
              {passenger.isCompleted && !passenger.isActive && (
                <Check className="w-4 h-4 text-success flex-shrink-0" strokeWidth={1.5} />
              )}
              {passenger.hasError && !passenger.isActive && (
                <AlertCircle className="w-4 h-4 text-error flex-shrink-0" strokeWidth={1.5} />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

// ─── PassengerNavigationCard ──────────────────────────────────────────────────

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
      <PassengerGroup
        passengers={adults.passengers}
        groupType="adult"
        title={adults.title}
        onPassengerClick={onPassengerClick}
      />

      {/* Minors Group */}
      {minors.passengers.length > 0 && (
        <PassengerGroup
          passengers={minors.passengers}
          groupType="minor"
          title={minors.title}
          onPassengerClick={onPassengerClick}
        />
      )}
    </div>
  );
};
