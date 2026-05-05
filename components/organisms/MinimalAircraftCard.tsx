import React from 'react';

export interface MinimalAircraftCardProps {
  /** Aircraft model */
  model: string;
  /** Aircraft registration */
  registration: string;
  /** Aircraft type badge text */
  badgeText: string;
  /** Badge color variant */
  badgeVariant?: 'primary' | 'secondary' | 'success';
  /** Optional image URL */
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

export const MinimalAircraftCard: React.FC<MinimalAircraftCardProps> = ({
  model,
  registration,
  badgeText,
  badgeVariant = 'primary',
  imageUrl,
}) => {
  const badgeStyle = badgeStyles[badgeVariant];

  return (
    <div className="w-full bg-surface rounded-md border border-border p-5 flex flex-col gap-4">
      {/* Title */}
      <h4 className="text-text text-caption font-semibold">Aeronave</h4>

      {/* Image */}
      <div className="w-full h-[100px] rounded-sm overflow-hidden">
        {imageUrl ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral to-muted/30 flex items-center justify-center">
            <span className="text-muted text-caption font-medium">
              {model}
            </span>
          </div>
        )}
      </div>

      {/* Badge */}
      <div className="inline-flex justify-center">
        <div className={`${badgeStyle.bg} rounded-sm h-5 px-3 flex items-center justify-center`}>
          <span className={`${badgeStyle.text} text-caption font-semibold`}>
            {badgeText}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-muted text-caption font-medium">Modelo</span>
            <span className="text-text text-caption font-semibold">{model}</span>
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-muted text-caption font-medium">Matricula</span>
            <span className="text-text text-caption font-semibold">{registration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
