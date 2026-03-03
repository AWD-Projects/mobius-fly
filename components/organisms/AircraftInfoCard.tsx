import React from 'react';
import { Plane } from 'lucide-react';
import { StatusBadge, type StatusBadgeVariant } from '../molecules/StatusBadge';

export interface AircraftInfoCardProps {
  model: string;
  registration: string;
  base: string;
  capacity: string;
  type: string;
  status: string;
  statusVariant?: 'active' | 'maintenance' | 'inactive';
}

const statusVariantMap: Record<NonNullable<AircraftInfoCardProps['statusVariant']>, StatusBadgeVariant> = {
  active: 'active',
  maintenance: 'warning',
  inactive: 'inactive',
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
  return (
    <div className="w-full bg-surface rounded-md border border-border p-7 flex items-center gap-7">
      <div className="w-20 h-20 rounded-sm bg-background flex items-center justify-center flex-shrink-0">
        <Plane className="w-8 h-8 text-neutral" strokeWidth={1} />
      </div>

      <div className="flex flex-col gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="text-text text-h3 font-medium leading-tight">{model}</h3>
          <StatusBadge status={statusVariantMap[statusVariant]}>{status}</StatusBadge>
        </div>

        <div className="flex items-start gap-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted text-caption font-medium">Matricula</span>
            <span className="text-text text-small font-medium">{registration}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted text-caption font-medium">Base</span>
            <span className="text-text text-small font-medium">{base}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted text-caption font-medium">Capacidad</span>
            <span className="text-text text-small font-medium">{capacity}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted text-caption font-medium">Tipo</span>
            <span className="text-text text-small font-medium">{type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
