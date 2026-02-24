import React from 'react';
import { LucideIcon } from 'lucide-react';
import { fontFamily } from '@/lib/utils';

export interface KpiData {
  value: string | number;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: 'success' | 'warning' | 'error' | 'info';
  icon?: string;
}

export interface KpiCardProps {
  /** The icon component to display */
  icon?: LucideIcon;
  /** The main metric value */
  value?: string | number;
  /** The title of the metric */
  title?: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Optional badge text (e.g., "+2 hoy") */
  badgeText?: string;
  /** Badge text color - defaults to success green */
  badgeColor?: 'success' | 'warning' | 'error' | 'info';
  /** Custom background color (hex or CSS color) */
  backgroundColor?: string;
  /** Background color variant - ignored if backgroundColor is provided */
  variant?: 'dark' | 'primary' | 'secondary';
  /** Custom icon background color */
  iconBackgroundColor?: string;
  /** Custom badge background color */
  badgeBackgroundColor?: string;
  /** Data object from API/endpoint (alternative to individual props) */
  data?: KpiData;
  /** Optional click handler */
  onClick?: () => void;
  /** Loading state */
  isLoading?: boolean;
}

const variantStyles = {
  dark: '#39424e',
  primary: '#2563eb',
  secondary: '#4b5563',
};

const badgeColorStyles = {
  success: 'text-[#4ADE80]',
  warning: 'text-[#F59E0B]',
  error: 'text-[#EF4444]',
  info: 'text-[#3B82F6]',
};

export const KpiCard: React.FC<KpiCardProps> = ({
  icon: Icon,
  value: propValue,
  title: propTitle,
  subtitle: propSubtitle,
  badgeText: propBadgeText,
  badgeColor: propBadgeColor = 'success',
  backgroundColor,
  variant = 'dark',
  iconBackgroundColor = '#2f3741',
  badgeBackgroundColor = '#2f3741',
  data,
  onClick,
  isLoading = false,
}) => {
  // Use data object if provided, otherwise use individual props
  const value = data?.value ?? propValue;
  const title = data?.title ?? propTitle;
  const subtitle = data?.subtitle ?? propSubtitle;
  const badgeText = data?.badgeText ?? propBadgeText;
  const badgeColor = data?.badgeColor ?? propBadgeColor;

  // Determine background color
  const bgColor = backgroundColor || variantStyles[variant];

  if (isLoading) {
    return (
      <div
        className="rounded-2xl p-6 w-[280px] flex flex-col animate-pulse"
        style={{ backgroundColor: bgColor, gap: '16px' }}
      >
        <div className="flex items-center justify-between w-full" style={{ gap: '12px' }}>
          <div className="w-10 h-10 rounded-[10px] bg-gray-600" />
          <div className="h-6 w-16 bg-gray-600 rounded-md" />
        </div>
        <div className="h-12 w-20 bg-gray-600 rounded-md" />
        <div className="flex flex-col" style={{ gap: '2px' }}>
          <div className="h-4 w-32 bg-gray-600 rounded-md" />
          <div className="h-3 w-40 bg-gray-600 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-6 w-[280px] flex flex-col ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      }`}
      style={{ backgroundColor: bgColor, gap: '16px' }}
      onClick={onClick}
    >
      {/* Header with Icon and Badge */}
      <div className="flex items-center justify-between w-full" style={{ gap: '12px' }}>
        {/* Icon Container */}
        {Icon && (
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: iconBackgroundColor }}
          >
            <Icon className="w-[18px] h-[18px] text-white" strokeWidth={2} />
          </div>
        )}

        {/* Badge */}
        {badgeText && (
          <div
            className="rounded-md"
            style={{ backgroundColor: badgeBackgroundColor, padding: '4px 8px' }}
          >
            <span
              className={`${badgeColorStyles[badgeColor]}`}
              style={{ fontFamily, fontSize: '11px', fontWeight: 500 }}
            >
              {badgeText}
            </span>
          </div>
        )}
      </div>

      {/* Main Value */}
      <div
        className="text-white leading-none"
        style={{ fontFamily, fontSize: '48px', fontWeight: 600, letterSpacing: '-2px' }}
      >
        {value}
      </div>

      {/* Footer */}
      <div className="flex flex-col" style={{ gap: '2px' }}>
        <div
          className="text-white leading-tight"
          style={{ fontFamily, fontSize: '14px', fontWeight: 500 }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            className="text-[#999999] leading-tight"
            style={{ fontFamily, fontSize: '12px', fontWeight: 400 }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
