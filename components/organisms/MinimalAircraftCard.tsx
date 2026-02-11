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

export const MinimalAircraftCard: React.FC<MinimalAircraftCardProps> = ({
  model,
  registration,
  badgeText,
  badgeVariant = 'primary',
  imageUrl,
}) => {
  const badgeStyle = badgeStyles[badgeVariant];

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-5 flex flex-col gap-4">
      {/* Title */}
      <h4 className="text-[#0A0A0A] text-xs font-semibold">Aeronave</h4>

      {/* Image */}
      <div className="w-full h-[100px] rounded-lg overflow-hidden">
        {imageUrl ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-[#999999] text-[11px] font-medium">
              {model}
            </span>
          </div>
        )}
      </div>

      {/* Badge */}
      <div className="inline-flex justify-center">
        <div className={`${badgeStyle.bg} rounded-md h-5 px-3 flex items-center justify-center`}>
          <span className={`${badgeStyle.text} text-[9px] font-semibold`}>
            {badgeText}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-[#999999] text-[9px] font-medium">Modelo</span>
            <span className="text-[#0A0A0A] text-[11px] font-semibold">{model}</span>
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-[#999999] text-[9px] font-medium">Matrícula</span>
            <span className="text-[#0A0A0A] text-[11px] font-semibold">{registration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
