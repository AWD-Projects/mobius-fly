import React from 'react';

export interface CrewDataItem {
  label: string;
  value: string;
}

export interface CrewDataCardProps {
  /** Card title */
  title?: string;
  /** Array of data items */
  data: CrewDataItem[];
}

export const CrewDataCard: React.FC<CrewDataCardProps> = ({
  title = 'Información del tripulante',
  data,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4">
      {/* Title */}
      <h3 className="text-[#0A0A0A] text-[13px] font-semibold">{title}</h3>

      {/* Data Grid */}
      <div className="flex flex-col gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between w-full"
          >
            <span className="text-[#666666] text-xs font-medium">
              {item.label}
            </span>
            <span className="text-[#0A0A0A] text-xs font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
