import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../atoms/Button';
import { StatusBadge, type StatusBadgeVariant } from '../molecules/StatusBadge';

export interface UpcomingFlightCardProps {
  /** Flight route (e.g., "Madrid → Nueva York") */
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
  const [origin, destination] = route.split(' → ');

  return (
    <div className="w-full max-w-full rounded-md bg-surface border border-border overflow-hidden flex flex-col">
      {/* Image */}
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

      {/* Content */}
      <div className="flex-1 px-4 pt-5 pb-5 sm:px-7 sm:pt-6 sm:pb-7 flex flex-col gap-5">
        {/* Route + Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            {/* Route with Lucide arrow */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-text text-h3 font-bold leading-tight">{origin}</h3>
              <ArrowRight size={20} className="text-muted flex-shrink-0" />
              {destination && (
                <h3 className="text-text text-h3 font-bold leading-tight">{destination}</h3>
              )}
            </div>
            {/* Meta */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-small font-normal text-muted">{date}</span>
              <span className="text-neutral text-small">·</span>
              <span className="text-small font-medium text-muted">{time}</span>
              {duration && (
                <>
                  <span className="text-neutral text-small">·</span>
                  <span className="text-small font-normal text-muted">{duration}</span>
                </>
              )}
            </div>
          </div>

          <StatusBadge status={statusVariantMap[statusVariant]} className="flex-shrink-0 mt-0.5">
            {status}
          </StatusBadge>
        </div>

        {/* Button */}
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
  );
};
