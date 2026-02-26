import React from 'react';

export interface AircraftCardWithImageProps {
  /** Aircraft model name */
  model: string;
  /** Registration number */
  registration: string;
  /** Passenger capacity */
  capacity: string;
  /** Range in km */
  range: string;
  /** Aircraft type badge text */
  badgeText: string;
  /** Badge color variant */
  badgeVariant?: 'primary' | 'secondary' | 'success';
  /** Aircraft image URL */
  imageUrl?: string;
}

const badgeStyles = {
  primary: {
    bg: 'bg-secondary/10',
    text: 'text-secondary',
  },
  secondary: {
    bg: 'bg-background',
    text: 'text-muted',
  },
  success: {
    bg: 'bg-[#E8F5E9]',
    text: 'text-success',
  },
};

export const AircraftCardWithImage: React.FC<AircraftCardWithImageProps> = ({
  model,
  registration,
  capacity,
  range,
  badgeText,
  badgeVariant = 'primary',
  imageUrl,
}) => {
  const badgeStyle = badgeStyles[badgeVariant];

  return (
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-5">
      {/* Title */}
      <h3 className="text-text text-body font-semibold">Aeronave</h3>

      {/* Image */}
      <div className="w-full h-60 rounded-sm overflow-hidden">
        {imageUrl ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral to-muted/30 flex items-center justify-center">
            <span className="text-muted text-small font-medium">{model}</span>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="flex flex-col gap-4">
        {/* Badge */}
        <div className="flex items-center gap-2">
          <div className={`${badgeStyle.bg} rounded-sm h-7 px-3 flex items-center justify-center`}>
            <span className={`${badgeStyle.text} text-caption font-semibold`}>
              {badgeText}
            </span>
          </div>
        </div>

        {/* Main Info Row */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-muted text-caption font-medium">Modelo</span>
            <span className="text-text text-small font-semibold">{model}</span>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-muted text-caption font-medium">Matricula</span>
            <span className="text-text text-small font-semibold">{registration}</span>
          </div>
        </div>

        {/* Details Row */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-muted text-caption font-medium">Capacidad</span>
            <span className="text-text text-small font-semibold">{capacity}</span>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-muted text-caption font-medium">Alcance</span>
            <span className="text-text text-small font-semibold">{range}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
