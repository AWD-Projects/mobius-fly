import React, { useState } from 'react';
import { Input } from '../atoms/Input';

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
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4">
      {/* Title */}
      <h3 className="text-[#0A0A0A] text-sm font-semibold">{title}</h3>

      {/* Label */}
      <p className="text-[#999999] text-xs font-normal">{label}</p>

      {/* Input */}
      <Input
        type="text"
        value={fleetName}
        onChange={(e) => setFleetName(e.target.value)}
        placeholder="Nombre de la flota"
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-40 h-10 bg-[#0A0A0A] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1a1a1a] transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
};
