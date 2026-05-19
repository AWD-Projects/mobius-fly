"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  licenses: string[];
}

export interface CrewInfoCardProps {
  crew: CrewMember[];
  onViewCrew?: () => void;
}

export const CrewInfoCard: React.FC<CrewInfoCardProps> = ({ crew, onViewCrew }) => {
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[11px] font-semibold text-text">Tripulación asignada</h2>
        {onViewCrew && (
          <Button
            variant="ghost"
            onClick={onViewCrew}
            className="flex items-center gap-1 text-xs font-medium text-[#666666] hover:text-text transition-colors"
          >
            <span>Ver tripulación</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Card */}
      <div className="w-full bg-white rounded-2xl border border-border overflow-hidden">
        {crew.map((member, index) => (
          <div
            key={member.id}
            className={`flex items-center justify-between px-7 py-5 ${
              index < crew.length - 1 ? "border-b border-[#F0F0F0]" : ""
            }`}
          >
            {/* Left: Avatar + Info */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#E3F2FD] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-info">{getInitials(member.name)}</span>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-text">{member.name}</span>
                <span className="text-xs text-muted">{member.role}</span>
              </div>
            </div>

            {/* Right: Licenses */}
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-xs text-muted">Licencias</span>
              <span className="text-xs font-medium text-text">{member.licenses.join(", ")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
