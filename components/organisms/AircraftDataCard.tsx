import React from 'react';

export interface AircraftDataItem {
  label: string;
  value: string;
}

export interface AircraftDataCardProps {
  /** Card title */
  title?: string;
  /** Array of data items to display */
  data: AircraftDataItem[];
}

export const AircraftDataCard: React.FC<AircraftDataCardProps> = ({
  title = 'Datos de la aeronave',
  data,
}) => {
  return (
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-4">
      {/* Title */}
      <h3 className="text-text text-small font-semibold">{title}</h3>

      {/* Data Grid */}
      <div className="flex flex-col gap-4">
        {data.map((item, index) => (
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
