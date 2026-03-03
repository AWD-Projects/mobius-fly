import React from 'react';
import { LucideIcon } from 'lucide-react';

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
  dark: 'var(--color-secondary)',
  primary: '#2563eb',
  secondary: '#4b5563',
};

const badgeColorStyles = {
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-secondary',
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
        className="rounded-md p-6 w-[280px] flex flex-col gap-4 animate-pulse"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex items-center justify-between w-full gap-3">
          <div className="w-10 h-10 rounded-sm bg-white/10" />
          <div className="h-6 w-16 bg-white/10 rounded-sm" />
        </div>
        <div className="h-12 w-20 bg-white/10 rounded-sm" />
        <div className="flex flex-col gap-0.5">
          <div className="h-4 w-32 bg-white/10 rounded-sm" />
          <div className="h-3 w-40 bg-white/10 rounded-sm" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-md p-6 w-[280px] flex flex-col gap-4 ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      }`}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      {/* Header with Icon and Badge */}
      <div className="flex items-center justify-between w-full gap-3">
        {/* Icon Container */}
        {Icon && (
          <div
            className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: iconBackgroundColor }}
          >
            <Icon className="w-[18px] h-[18px] text-white" strokeWidth={1} />
          </div>
        )}

        {/* Badge */}
        {badgeText && (
          <div
            className="rounded-sm px-2 py-1"
            style={{ backgroundColor: badgeBackgroundColor }}
          >
            <span className={`${badgeColorStyles[badgeColor]} text-caption font-medium`}>
              {badgeText}
            </span>
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="text-white text-h1 font-semibold leading-none tracking-tight">
        {value}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-0.5">
        <div className="text-white text-small font-medium leading-tight">
          {title}
        </div>
        {subtitle && (
          <div className="text-muted text-caption font-normal leading-tight">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
