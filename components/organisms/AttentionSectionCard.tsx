import React from 'react';
import { TriangleAlert, LucideIcon, ChevronRight } from 'lucide-react';

export interface AttentionItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  iconColor?: string;
}

export interface AttentionSectionCardProps {
  /** Card title */
  title?: string;
  /** Array of attention items */
  items: AttentionItem[];
  /** Item click handler */
  onItemClick?: (index: number) => void;
}

export const AttentionSectionCard: React.FC<AttentionSectionCardProps> = ({
  title = 'Requiere atención',
  items,
  onItemClick,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#FFF8E1] flex items-center justify-center">
          <TriangleAlert className="w-4 h-4 text-[#F57F17]" strokeWidth={2} />
        </div>
        <h3 className="text-[#0A0A0A] text-[15px] font-semibold">{title}</h3>
      </div>

      {/* Attention List */}
      <div className="flex flex-col gap-3">
        {items.map((item, index) => {
          const ItemIcon = item.icon;
          const iconColor = item.iconColor || '#F57F17';

          return (
            <button
              key={index}
              onClick={() => onItemClick?.(index)}
              className="w-full bg-[#FAFAFA] rounded-xl px-4 py-3.5 flex items-center gap-3 hover:bg-gray-100 transition-colors"
            >
              <ItemIcon
                className="w-[18px] h-[18px] flex-shrink-0"
                style={{ color: iconColor }}
                strokeWidth={2}
              />
              <div className="flex flex-col gap-0.5 flex-1 text-left min-w-0">
                <span className="text-[#0A0A0A] text-[13px] font-medium leading-tight">
                  {item.title}
                </span>
                <span className="text-[#999999] text-xs font-normal leading-tight">
                  {item.subtitle}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CCCCCC] flex-shrink-0" strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
