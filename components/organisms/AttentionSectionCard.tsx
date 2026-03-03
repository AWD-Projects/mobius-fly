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
  title = 'Requiere atencion',
  items,
  onItemClick,
}) => {
  return (
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-sm bg-[#FFF8E1] flex items-center justify-center">
          <TriangleAlert className="w-4 h-4 text-warning" strokeWidth={1} />
        </div>
        <h3 className="text-text text-body font-semibold">{title}</h3>
      </div>

      {/* Attention List */}
      <div className="flex flex-col gap-3">
        {items.map((item, index) => {
          const ItemIcon = item.icon;
          const iconColor = item.iconColor || 'var(--color-warning)';

          return (
            <button
              key={index}
              onClick={() => onItemClick?.(index)}
              className="w-full bg-background rounded-sm px-4 py-3.5 flex items-center gap-3 hover:bg-neutral/30 transition-colors"
            >
              <ItemIcon
                className="w-[18px] h-[18px] flex-shrink-0"
                style={{ color: iconColor }}
                strokeWidth={1}
              />
              <div className="flex flex-col gap-0.5 flex-1 text-left min-w-0">
                <span className="text-text text-small font-medium leading-tight">
                  {item.title}
                </span>
                <span className="text-muted text-caption font-normal leading-tight">
                  {item.subtitle}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral flex-shrink-0" strokeWidth={1} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
