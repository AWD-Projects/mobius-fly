import React, { useState } from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

export interface FleetNameCardProps {
  /** Card title */
  title?: string;
  /** Label text */
  label?: string;
  /** Initial fleet name value */
  initialValue?: string;
  /** Save button text */
  buttonText?: string;
  /** Save handler with new fleet name */
  onSave?: (fleetName: string) => void;
}

export const FleetNameCard: React.FC<FleetNameCardProps> = ({
  title = 'Nombre de la flota',
  label = 'Nombre identificador de tu flota',
  initialValue = '',
  buttonText = 'Guardar cambios',
  onSave,
}) => {
  const [fleetName, setFleetName] = useState(initialValue);

  const handleSave = () => {
    onSave?.(fleetName);
  };

  return (
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-4">
      {/* Title */}
      <h3 className="text-text text-small font-semibold">{title}</h3>

      {/* Label */}
      <p className="text-muted text-caption font-normal">{label}</p>

      {/* Input */}
      <Input
        type="text"
        value={fleetName}
        onChange={(e) => setFleetName(e.target.value)}
        placeholder="Nombre de la flota"
      />

      {/* Save Button */}
      <Button
        variant="secondary"
        size="md"
        onClick={handleSave}
        className="w-40"
      >
        {buttonText}
      </Button>
    </div>
  );
};
