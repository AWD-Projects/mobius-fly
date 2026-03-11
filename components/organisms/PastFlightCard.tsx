import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../atoms/Button';
import { StatusBadge, type StatusBadgeVariant } from '../molecules/StatusBadge';

export interface PastFlightCardProps {
  /** Flight route (e.g., "Paris -> Barcelona") */
  route: string;
  /** Flight date */
  date: string;
  /** Flight time range (e.g., "09:30 - 11:15") */
  timeRange: string;
  /** Status text */
  status: string;
  /** Status variant for styling */
  statusVariant?: 'completed' | 'cancelled' | 'delayed';
  /** Flight image URL */
  imageUrl?: string;
  /** Button click handler */
  onDetailsClick?: () => void;
  /** Optional custom button text */
  buttonText?: string;
}

const statusVariantMap: Record<NonNullable<PastFlightCardProps['statusVariant']>, StatusBadgeVariant> = {
  completed: 'completed',
  cancelled: 'rejected',
  delayed: 'warning',
};

export const PastFlightCard: React.FC<PastFlightCardProps> = ({
  route,
  date,
  timeRange,
  status,
  statusVariant = 'completed',
  imageUrl,
  onDetailsClick,
  buttonText = 'Ver detalles',
}) => {
  const [origin, destination] = route.split(' → ');

  return (
    <div className="w-full max-w-full rounded-md bg-surface border border-border overflow-hidden flex flex-col sm:flex-row sm:h-[140px]">
      {/* Image Section */}
      <div className="w-full h-[140px] sm:w-[180px] sm:h-full flex-shrink-0">
        {imageUrl ? (
          <div
            className="w-full h-full bg-cover bg-center rounded-t-md sm:rounded-t-none sm:rounded-l-md"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral to-muted/30 rounded-t-md sm:rounded-t-none sm:rounded-l-md" />
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 px-4 py-5 sm:px-6 sm:py-5 flex flex-col gap-4 justify-between min-w-0">
        {/* Top: Route and Status */}
        <div className="flex items-start justify-between gap-4">
          {/* Route Section */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-text text-body font-semibold leading-tight">{origin}</h3>
              <ArrowRight size={16} className="text-muted flex-shrink-0" />
              {destination && (
                <h3 className="text-text text-body font-semibold leading-tight">{destination}</h3>
              )}
            </div>
            <div className="flex items-center gap-3 text-muted">
              <span className="text-caption font-normal">{date}</span>
              <span className="text-neutral text-caption font-normal">&#8226;</span>
              <span className="text-caption font-normal">{timeRange}</span>
            </div>
          </div>

          {/* Status Badge */}
          <StatusBadge status={statusVariantMap[statusVariant]} className="flex-shrink-0">
            {status}
          </StatusBadge>
        </div>

        {/* Bottom: Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onDetailsClick}
          className="w-full sm:w-[130px]"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
