import React from 'react';
import { Button } from '../atoms/Button';
import { StatusBadge, type StatusBadgeVariant } from '../molecules/StatusBadge';

export interface UpcomingFlightCardProps {
  /** Flight route (e.g., "Madrid -> Nueva York") */
  route: string;
  /** Flight date */
  date: string;
  /** Departure time */
  time: string;
  /** Flight duration */
  duration: string;
  /** Status text */
  status: string;
  /** Status color variant */
  statusVariant?: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  /** Background image URL */
  imageUrl?: string;
  /** Button click handler */
  onDetailsClick?: () => void;
  /** Optional custom button text */
  buttonText?: string;
}

const statusVariantMap: Record<NonNullable<UpcomingFlightCardProps['statusVariant']>, StatusBadgeVariant> = {
  confirmed: 'active',
  pending: 'pending',
  cancelled: 'rejected',
  completed: 'completed',
};

export const UpcomingFlightCard: React.FC<UpcomingFlightCardProps> = ({
  route,
  date,
  time,
  duration,
  status,
  statusVariant = 'confirmed',
  imageUrl,
  onDetailsClick,
  buttonText = 'Ver detalles del vuelo',
}) => {

  return (
    <div className="w-full max-w-full rounded-md bg-surface border border-border overflow-hidden h-[320px] flex flex-col">
      {/* Image Background with Overlay */}
      <div className="relative h-[160px] flex-shrink-0">
        {imageUrl ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center rounded-t-md"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="absolute inset-0 bg-black opacity-15 rounded-t-md" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral to-muted/30 rounded-t-md" />
        )}
      </div>

      {/* Content Section */}
      <div className="h-[160px] px-7 py-6 flex flex-col justify-between">
        {/* Top Row: Route Info and Status */}
        <div className="flex items-center justify-between gap-4">
          {/* Route Info */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <h3 className="text-text text-h3 font-bold leading-tight">
              {route}
            </h3>
            <div className="flex items-center gap-4 text-muted">
              <span className="text-small font-normal">{date}</span>
              <span className="text-small font-medium">{time}</span>
              <span className="text-neutral text-small font-normal">&#8226;</span>
              <span className="text-small font-normal">{duration}</span>
            </div>
          </div>

          {/* Status Badge */}
          <StatusBadge status={statusVariantMap[statusVariant]} className="flex-shrink-0">
            {status}
          </StatusBadge>
        </div>

        {/* Bottom Row: Button */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={onDetailsClick}
            className="w-full"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
