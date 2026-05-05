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
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-4">
      {/* Title */}
      <h3 className="text-text text-small font-semibold">{title}</h3>

      {/* Data Grid */}
      <div className="flex flex-col">
        {data.map((item, index) => {
          const isLast = index === data.length - 1;

          return (
            <div
              key={index}
              className={`flex items-center justify-between w-full py-3 ${
                !isLast ? 'border-b border-border' : ''
              }`}
            >
              <span className="text-muted text-caption font-medium">
                {item.label}
              </span>
              <span className="text-text text-small font-semibold text-right">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
