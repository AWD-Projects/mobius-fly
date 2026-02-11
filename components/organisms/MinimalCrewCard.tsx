import React from 'react';

export interface CrewMember {
  name: string;
  role: string;
  license: string;
  initials: string;
  avatarBgColor?: string;
}

export interface MinimalCrewCardProps {
  /** Array of crew members */
  crew: CrewMember[];
}

export const MinimalCrewCard: React.FC<MinimalCrewCardProps> = ({ crew }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden flex flex-col">
      {crew.map((member, index) => {
        const isLast = index === crew.length - 1;

        return (
          <div
            key={index}
            className={`flex items-center justify-between px-7 py-5 ${
              !isLast ? 'border-b border-[#F0F0F0]' : ''
            }`}
          >
            {/* Left: Avatar and Info */}
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: member.avatarBgColor || '#0A0A0A' }}
              >
                <span className="text-white text-sm font-medium">
                  {member.initials}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[#0A0A0A] text-sm font-medium leading-tight">
                  {member.name}
                </span>
                <span className="text-[#666666] text-xs font-normal leading-tight">
                  {member.role}
                </span>
              </div>
            </div>

            {/* Right: License */}
            <div className="flex flex-col gap-0.5 items-end">
              <span className="text-[#999999] text-[11px] font-medium">
                Licencia
              </span>
              <span className="text-[#0A0A0A] text-[13px] font-medium">
                {member.license}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
