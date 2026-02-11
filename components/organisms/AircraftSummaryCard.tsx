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
  title = 'Resumen rápido',
  items,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4">
      {/* Title */}
      <h3 className="text-[#0A0A0A] text-sm font-semibold">{title}</h3>

      {/* Summary Grid */}
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between w-full"
          >
            <span className="text-[#666666] text-xs font-medium">
              {item.label}
            </span>
            <span className="text-[#0A0A0A] text-[13px] font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
