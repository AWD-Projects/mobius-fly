import React from 'react';
import { Eye, Edit2 } from 'lucide-react';

export interface CrewListCardProps {
  /** Crew member name */
  name: string;
  /** Role */
  role: string;
  /** Base location */
  base: string;
  /** License information */
  license: string;
  /** Status */
  status: string;
  /** Status variant */
  statusVariant?: 'active' | 'inactive';
  /** Avatar initials */
  avatarInitials: string;
  /** Avatar background color */
  avatarBgColor?: string;
  /** View action handler */
  onView?: () => void;
  /** Edit action handler */
  onEdit?: () => void;
}

const statusStyles = {
  active: { bg: 'bg-[#E8F5E9]', text: 'text-[#2E7D32]', dot: 'bg-[#2E7D32]' },
  inactive: { bg: 'bg-[#F0F0F0]', text: 'text-[#666666]', dot: 'bg-[#999999]' },
};

export const CrewListCard: React.FC<CrewListCardProps> = ({
  name,
  role,
  base,
  license,
  status,
  statusVariant = 'active',
  avatarInitials,
  avatarBgColor = '#E3F2FD',
  onView,
  onEdit,
}) => {
  const statusStyle = statusStyles[statusVariant];

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4">
      {/* Header with Avatar */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: avatarBgColor }}
        >
          <span className="text-[#1976D2] text-sm font-semibold">
            {avatarInitials}
          </span>
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h3 className="text-[#0A0A0A] text-sm font-semibold">{name}</h3>
          <p className="text-[#666666] text-xs font-medium">{role}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#F0F0F0]" />

      {/* Body */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[#666666] text-xs font-medium">Base</span>
          <span className="text-[#0A0A0A] text-xs font-medium">{base}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#666666] text-xs font-medium">Licencias</span>
          <span className="text-[#0A0A0A] text-xs font-medium text-right">{license}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#666666] text-xs font-medium">Estado</span>
          <div className={`${statusStyle.bg} rounded-md h-7 px-2.5 inline-flex items-center gap-1.5`}>
            <div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
            <span className={`${statusStyle.text} text-[11px] font-medium`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={onView} className="p-0">
          <Eye className="w-[18px] h-[18px] text-[#1976D2]" strokeWidth={2} />
        </button>
        <button onClick={onEdit} className="p-0">
          <Edit2 className="w-[18px] h-[18px] text-[#666666]" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
