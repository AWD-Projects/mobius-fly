import React from 'react';
import { Button } from '../atoms/Button';

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
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-3">
      {/* Title */}
      <h3 className="text-text text-small font-semibold">{title}</h3>

      {/* Primary Action Button */}
      <Button
        variant="secondary"
        size="md"
        onClick={onPrimaryAction}
        className="w-full"
      >
        {primaryActionText}
      </Button>

      {/* Secondary Action Button */}
      <Button
        variant="outline"
        size="md"
        onClick={onSecondaryAction}
        className="w-full"
      >
        {secondaryActionText}
      </Button>
    </div>
  );
};
