import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonBadge,
} from "@/components/atoms/Skeleton";

// List Item Skeleton
export interface SkeletonListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  showAvatar?: boolean;
  showBadge?: boolean;
  showActions?: boolean;
  showDivider?: boolean;
  avatarSize?: "sm" | "md" | "lg";
  lines?: 1 | 2 | 3;
}

const SkeletonListItem = React.forwardRef<HTMLDivElement, SkeletonListItemProps>(
  (
    {
      className,
      showAvatar = true,
      showBadge = false,
      showActions = false,
      showDivider = true,
      avatarSize = "md",
      lines = 2,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-4 py-4",
          showDivider && "border-b border-[#F0F0F0]",
          className
        )}
        {...props}
      >
        {showAvatar && <SkeletonAvatar size={avatarSize} />}
        <div className="flex-1 min-w-0">
          <Skeleton height={14} width="60%" className="mb-1.5" />
          {lines >= 2 && <Skeleton height={12} width="80%" />}
          {lines >= 3 && <Skeleton height={12} width="40%" className="mt-1.5" />}
        </div>
        {showBadge && <SkeletonBadge width={70} />}
        {showActions && (
          <div className="flex gap-1">
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="circular" width={28} height={28} />
          </div>
        )}
      </div>
    );
  }
);
SkeletonListItem.displayName = "SkeletonListItem";

// List Skeleton - Multiple items
export interface SkeletonListProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: number;
  showAvatar?: boolean;
  showBadge?: boolean;
  showActions?: boolean;
  avatarSize?: "sm" | "md" | "lg";
  lines?: 1 | 2 | 3;
  variant?: "default" | "compact" | "detailed";
}

const SkeletonList = React.forwardRef<HTMLDivElement, SkeletonListProps>(
  (
    {
      className,
      items = 5,
      showAvatar = true,
      showBadge = false,
      showActions = false,
      avatarSize = "md",
      lines = 2,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const getVariantProps = () => {
      switch (variant) {
        case "compact":
          return { lines: 1 as const, avatarSize: "sm" as const };
        case "detailed":
          return { lines: 3 as const, avatarSize: "lg" as const };
        default:
          return { lines, avatarSize };
      }
    };

    const variantProps = getVariantProps();

    return (
      <div ref={ref} className={cn("divide-y divide-[#F0F0F0]", className)} {...props}>
        {Array.from({ length: items }).map((_, index) => (
          <SkeletonListItem
            key={index}
            showAvatar={showAvatar}
            showBadge={showBadge}
            showActions={showActions}
            showDivider={false}
            {...variantProps}
          />
        ))}
      </div>
    );
  }
);
SkeletonList.displayName = "SkeletonList";

// Navigation/Menu List Skeleton
export interface SkeletonNavListProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: number;
  showIcons?: boolean;
}

const SkeletonNavList = React.forwardRef<HTMLDivElement, SkeletonNavListProps>(
  ({ className, items = 6, showIcons = true, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-1", className)} {...props}>
        {Array.from({ length: items }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
          >
            {showIcons && <Skeleton width={20} height={20} />}
            <Skeleton height={14} width={`${60 + ((index * 13) % 30)}%`} />
          </div>
        ))}
      </div>
    );
  }
);
SkeletonNavList.displayName = "SkeletonNavList";

// Info List Skeleton (key-value pairs)
export interface SkeletonInfoListProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: number;
  labelWidth?: number | string;
}

const SkeletonInfoList = React.forwardRef<HTMLDivElement, SkeletonInfoListProps>(
  ({ className, items = 4, labelWidth = 100, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="flex items-start gap-4">
            <Skeleton
              height={12}
              width={labelWidth}
              className="flex-shrink-0 mt-0.5"
            />
            <Skeleton height={14} width={`${50 + ((index * 17) % 40)}%`} />
          </div>
        ))}
      </div>
    );
  }
);
SkeletonInfoList.displayName = "SkeletonInfoList";

export { SkeletonListItem, SkeletonList, SkeletonNavList, SkeletonInfoList };
