import React from 'react';

export interface AircraftSummaryItem {
  label: string;
  value: string;
}

export interface AircraftSummaryCardProps {
  /** Card title */
  title?: string;
  /** Array of summary items */
  items: AircraftSummaryItem[];
}

export const AircraftSummaryCard: React.FC<AircraftSummaryCardProps> = ({
  title = 'Resumen rapido',
  items,
}) => {
  return (
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-4">
      {/* Title */}
      <h3 className="text-text text-small font-semibold">{title}</h3>

      {/* Summary Grid */}
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between w-full"
          >
            <span className="text-muted text-caption font-medium">
              {item.label}
            </span>
            <span className="text-text text-small font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
