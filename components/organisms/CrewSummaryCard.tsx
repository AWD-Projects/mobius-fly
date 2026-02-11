import React from 'react';

export interface CrewSummaryItem {
  label: string;
  value: string;
}

export interface CrewSummaryCardProps {
  /** Card title */
  title?: string;
  /** Array of summary items */
  items: CrewSummaryItem[];
}

export const CrewSummaryCard: React.FC<CrewSummaryCardProps> = ({
  title = 'Resumen',
  items,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-3.5">
      {/* Title */}
      <h3 className="text-[#0A0A0A] text-[13px] font-semibold">{title}</h3>

      {/* Summary Grid */}
      <div className="flex flex-col gap-3.5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between w-full">
            <span className="text-[#999999] text-[11px] font-medium">
              {item.label}
            </span>
            <span className="text-[#0A0A0A] text-[11px] font-semibold text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
