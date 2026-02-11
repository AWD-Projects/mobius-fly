import React from 'react';

export interface AircraftActionsCardProps {
  /** Card title */
  title?: string;
  /** Primary action text */
  primaryActionText?: string;
  /** Secondary action text */
  secondaryActionText?: string;
  /** Primary action handler */
  onPrimaryAction?: () => void;
  /** Secondary action handler */
  onSecondaryAction?: () => void;
}

export const AircraftActionsCard: React.FC<AircraftActionsCardProps> = ({
  title = 'Acciones',
  primaryActionText = 'Marcar como mantenimiento',
  secondaryActionText = 'Editar aeronave',
  onPrimaryAction,
  onSecondaryAction,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-3">
      {/* Title */}
      <h3 className="text-[#0A0A0A] text-sm font-semibold">{title}</h3>

      {/* Primary Action Button */}
      <button
        onClick={onPrimaryAction}
        className="w-full h-10 bg-[#0A0A0A] text-white text-xs font-medium rounded-xl hover:bg-[#1a1a1a] transition-colors flex items-center justify-center"
      >
        {primaryActionText}
      </button>

      {/* Secondary Action Button */}
      <button
        onClick={onSecondaryAction}
        className="w-full h-10 border border-[#E5E5E5] bg-transparent text-[#666666] text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
      >
        {secondaryActionText}
      </button>
    </div>
  );
};
