import React from 'react';
import { Eye, Edit2 } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';
import { StatusBadge, type StatusBadgeVariant } from '../molecules/StatusBadge';

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

const statusVariantMap: Record<NonNullable<CrewListCardProps['statusVariant']>, StatusBadgeVariant> = {
  active: 'active',
  inactive: 'inactive',
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

  return (
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-4">
      {/* Header with Avatar */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: avatarBgColor }}
        >
          <span className="text-secondary text-small font-semibold">
            {avatarInitials}
          </span>
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h3 className="text-text text-small font-semibold">{name}</h3>
          <p className="text-muted text-caption font-medium">{role}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border" />

      {/* Body */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-muted text-caption font-medium">Base</span>
          <span className="text-text text-caption font-medium">{base}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted text-caption font-medium">Licencias</span>
          <span className="text-text text-caption font-medium text-right">{license}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted text-caption font-medium">Estado</span>
          <StatusBadge status={statusVariantMap[statusVariant]}>{status}</StatusBadge>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <IconButton
          icon={<Eye className="w-[18px] h-[18px] text-secondary" strokeWidth={1} />}
          onClick={onView}
          variant="ghost"
          size="sm"
          aria-label="Ver detalle"
        />
        <IconButton
          icon={<Edit2 className="w-[18px] h-[18px] text-muted" strokeWidth={1} />}
          onClick={onEdit}
          variant="ghost"
          size="sm"
          aria-label="Editar"
        />
      </div>
    </div>
  );
};
