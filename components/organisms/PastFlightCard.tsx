import React from 'react';

export interface PastFlightCardProps {
  /** Flight route (e.g., "París → Barcelona") */
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

const statusStyles = {
  completed: {
    bg: 'bg-[#F0F0F0]',
    text: 'text-[#666666]',
    dot: 'bg-[#999999]',
  },
  cancelled: {
    bg: 'bg-[#FFEBEE]',
    text: 'text-[#C62828]',
    dot: 'bg-[#C62828]',
  },
  delayed: {
    bg: 'bg-[#FFF8E1]',
    text: 'text-[#F57C00]',
    dot: 'bg-[#F57C00]',
  },
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
  const statusStyle = statusStyles[statusVariant];

  return (
    <div className="w-full max-w-full h-[140px] rounded-2xl bg-white border border-[#E5E5E5] overflow-hidden flex">
      {/* Image Section */}
      <div className="w-[180px] h-full flex-shrink-0">
        {imageUrl ? (
          <div
            className="w-full h-full bg-cover bg-center rounded-l-2xl"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-l-2xl" />
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 px-6 py-5 flex flex-col justify-between min-w-0">
        {/* Top: Route and Status */}
        <div className="flex items-start justify-between gap-4">
          {/* Route Section */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <h3 className="text-[#0A0A0A] text-[15px] font-semibold leading-tight">
              {route}
            </h3>
            <div className="flex items-center gap-3 text-[#999999]">
              <span className="text-xs font-normal">{date}</span>
              <span className="text-[#D0D0D0] text-xs font-normal">•</span>
              <span className="text-xs font-normal">{timeRange}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`${statusStyle.bg} rounded-md px-3 py-2 flex items-center gap-2 flex-shrink-0`}>
            <div className={`w-2 h-2 rounded ${statusStyle.dot}`} />
            <span className={`${statusStyle.text} text-xs font-medium`}>
              {status}
            </span>
          </div>
        </div>

        {/* Bottom: Button */}
        <button
          onClick={onDetailsClick}
          className="w-[130px] h-9 border border-[#E5E5E5] rounded-lg text-[#666666] text-xs font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
