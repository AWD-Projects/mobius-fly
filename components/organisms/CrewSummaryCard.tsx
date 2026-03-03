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
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-3.5">
      {/* Title */}
      <h3 className="text-text text-small font-semibold">{title}</h3>

      {/* Summary Grid */}
      <div className="flex flex-col gap-3.5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between w-full">
            <span className="text-muted text-caption font-medium">
              {item.label}
            </span>
            <span className="text-text text-caption font-semibold text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
