import React from 'react';

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

const statusStyles = {
  confirmed: {
    bg: 'bg-[#E8F5E9]',
    text: 'text-[#2E7D32]',
    dot: 'bg-[#2E7D32]',
  },
  pending: {
    bg: 'bg-[#FFF8E1]',
    text: 'text-[#F57C00]',
    dot: 'bg-[#F57C00]',
  },
  cancelled: {
    bg: 'bg-[#FFEBEE]',
    text: 'text-[#C62828]',
    dot: 'bg-[#C62828]',
  },
  completed: {
    bg: 'bg-[#E3F2FD]',
    text: 'text-[#1565C0]',
    dot: 'bg-[#1565C0]',
  },
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
  const statusStyle = statusStyles[statusVariant];

  return (
    <div className="w-full max-w-full rounded-2xl bg-white border border-[#E5E5E5] overflow-hidden h-[320px] flex flex-col">
      {/* Image Background with Overlay */}
      <div className="relative h-[160px] flex-shrink-0">
        {imageUrl ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center rounded-t-2xl"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="absolute inset-0 bg-black opacity-15 rounded-t-2xl" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 rounded-t-2xl" />
        )}
      </div>

      {/* Content Section */}
      <div className="h-[160px] px-7 py-6 flex flex-col justify-between">
        {/* Top Row: Route Info and Status */}
        <div className="flex items-center justify-between gap-4">
          {/* Route Info */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <h3 className="text-[#0A0A0A] text-2xl font-bold leading-tight">
              {route}
            </h3>
            <div className="flex items-center gap-4 text-[#666666]">
              <span className="text-[13px] font-normal">{date}</span>
              <span className="text-[13px] font-medium">{time}</span>
              <span className="text-[#999999] text-[13px] font-normal">•</span>
              <span className="text-[13px] font-normal">{duration}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`${statusStyle.bg} rounded-lg px-3.5 py-2 flex items-center gap-2 flex-shrink-0`}>
            <div className={`w-2 h-2 rounded ${statusStyle.dot}`} />
            <span className={`${statusStyle.text} text-[13px] font-semibold`}>
              {status}
            </span>
          </div>
        </div>

        {/* Bottom Row: Button */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onDetailsClick}
            className="w-full h-11 bg-[#0A0A0A] text-white text-sm font-semibold rounded-xl hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};
