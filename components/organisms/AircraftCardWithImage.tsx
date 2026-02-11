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
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#0C4A6E]',
  },
  secondary: {
    bg: 'bg-[#F0F0F0]',
    text: 'text-[#666666]',
  },
  success: {
    bg: 'bg-[#E8F5E9]',
    text: 'text-[#2E7D32]',
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
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-5">
      {/* Title */}
      <h3 className="text-[#0A0A0A] text-base font-semibold">Aeronave</h3>

      {/* Image */}
      <div className="w-full h-60 rounded-xl overflow-hidden">
        {imageUrl ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-[#999999] text-sm font-medium">{model}</span>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="flex flex-col gap-4">
        {/* Badge */}
        <div className="flex items-center gap-2">
          <div className={`${badgeStyle.bg} rounded-md h-7 px-3 flex items-center justify-center`}>
            <span className={`${badgeStyle.text} text-[11px] font-semibold`}>
              {badgeText}
            </span>
          </div>
        </div>

        {/* Main Info Row */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[#999999] text-xs font-medium">Modelo</span>
            <span className="text-[#0A0A0A] text-[13px] font-semibold">{model}</span>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[#999999] text-xs font-medium">Matrícula</span>
            <span className="text-[#0A0A0A] text-[13px] font-semibold">{registration}</span>
          </div>
        </div>

        {/* Details Row */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[#999999] text-xs font-medium">Capacidad</span>
            <span className="text-[#0A0A0A] text-[13px] font-semibold">{capacity}</span>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[#999999] text-xs font-medium">Alcance</span>
            <span className="text-[#0A0A0A] text-[13px] font-semibold">{range}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
