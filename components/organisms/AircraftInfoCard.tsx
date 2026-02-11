import React from 'react';
import { Plane } from 'lucide-react';

export interface AircraftInfoCardProps {
  /** Aircraft model name */
  model: string;
  /** Aircraft registration number */
  registration: string;
  /** Base location */
  base: string;
  /** Passenger capacity */
  capacity: string;
  /** Aircraft type */
  type: string;
  /** Status */
  status: string;
  /** Status variant */
  statusVariant?: 'active' | 'maintenance' | 'inactive';
}

const statusStyles = {
  active: {
    bg: 'bg-[#E8F5E9]',
    text: 'text-[#2E7D32]',
    dot: 'bg-[#2E7D32]',
  },
  maintenance: {
    bg: 'bg-[#FFF8E1]',
    text: 'text-[#F57C00]',
    dot: 'bg-[#F57C00]',
  },
  inactive: {
    bg: 'bg-[#F0F0F0]',
    text: 'text-[#666666]',
    dot: 'bg-[#999999]',
  },
};

export const AircraftInfoCard: React.FC<AircraftInfoCardProps> = ({
  model,
  registration,
  base,
  capacity,
  type,
  status,
  statusVariant = 'active',
}) => {
  const statusStyle = statusStyles[statusVariant];

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-7 flex items-center gap-7">
      {/* Icon Box */}
      <div className="w-20 h-20 rounded-xl bg-[#FAFAFA] flex items-center justify-center flex-shrink-0">
        <Plane className="w-8 h-8 text-[#CCCCCC]" strokeWidth={1.5} />
      </div>

      {/* Aircraft Info */}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        {/* Model Row */}
        <div className="flex items-center gap-3">
          <h3 className="text-[#0A0A0A] text-2xl font-medium leading-tight">
            {model}
          </h3>
          <div className={`${statusStyle.bg} rounded px-2.5 py-1 flex items-center gap-1.5 flex-shrink-0`}>
            <div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
            <span className={`${statusStyle.text} text-[11px] font-medium`}>
              {status}
            </span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="flex items-start gap-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-[#999999] text-[11px] font-medium">Matrícula</span>
            <span className="text-[#0A0A0A] text-sm font-medium">{registration}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[#999999] text-[11px] font-medium">Base</span>
            <span className="text-[#0A0A0A] text-sm font-medium">{base}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[#999999] text-[11px] font-medium">Capacidad</span>
            <span className="text-[#0A0A0A] text-sm font-medium">{capacity}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[#999999] text-[11px] font-medium">Tipo</span>
            <span className="text-[#0A0A0A] text-sm font-medium">{type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
