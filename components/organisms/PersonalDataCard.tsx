import React from 'react';

export interface PersonalDataItem {
  label: string;
  value: string;
}

export interface PersonalDataCardProps {
  /** Card title */
  title?: string;
  /** Array of personal data items */
  data: PersonalDataItem[];
}

export const PersonalDataCard: React.FC<PersonalDataCardProps> = ({
  title = 'Datos personales',
  data,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4">
      {/* Title */}
      <h3 className="text-[#0A0A0A] text-sm font-semibold">{title}</h3>

      {/* Data Grid */}
      <div className="flex flex-col">
        {data.map((item, index) => {
          const isLast = index === data.length - 1;

          return (
            <div
              key={index}
              className={`flex items-center justify-between w-full py-3 ${
                !isLast ? 'border-b border-[#F0F0F0]' : ''
              }`}
            >
              <span className="text-[#999999] text-xs font-medium">
                {item.label}
              </span>
              <span className="text-[#0A0A0A] text-[13px] font-semibold text-right">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
