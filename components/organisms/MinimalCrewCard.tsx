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
    <div className="w-full bg-surface rounded-md border border-border overflow-hidden flex flex-col">
      {crew.map((member, index) => {
        const isLast = index === crew.length - 1;

        return (
          <div
            key={index}
            className={`flex items-center justify-between px-7 py-5 ${
              !isLast ? 'border-b border-border' : ''
            }`}
          >
            {/* Left: Avatar and Info */}
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: member.avatarBgColor || 'var(--color-secondary)' }}
              >
                <span className="text-white text-small font-medium">
                  {member.initials}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-text text-small font-medium leading-tight">
                  {member.name}
                </span>
                <span className="text-muted text-caption font-normal leading-tight">
                  {member.role}
                </span>
              </div>
            </div>

            {/* Right: License */}
            <div className="flex flex-col gap-0.5 items-end">
              <span className="text-muted text-caption font-medium">
                Licencia
              </span>
              <span className="text-text text-small font-medium">
                {member.license}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
