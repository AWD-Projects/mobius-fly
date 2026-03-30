import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage,
  SkeletonBadge,
} from "@/components/atoms/Skeleton";

// Base Card Skeleton
export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "horizontal" | "compact";
  showImage?: boolean;
  showAvatar?: boolean;
  showBadge?: boolean;
  showActions?: boolean;
  imageAspectRatio?: "square" | "video" | "wide";
}

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  (
    {
      className,
      variant = "default",
      showImage = true,
      showAvatar = false,
      showBadge = false,
      showActions = false,
      imageAspectRatio = "video",
      ...props
    },
    ref
  ) => {
    if (variant === "horizontal") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex overflow-hidden rounded-md border border-border bg-white",
            className
          )}
          {...props}
        >
          {showImage && (
            <SkeletonImage
              aspectRatio="square"
              className="w-32 h-32 rounded-none flex-shrink-0"
            />
          )}
          <div className="flex-1 p-4 flex flex-col justify-center">
            <Skeleton height={16} width="70%" className="mb-2" />
            <Skeleton height={12} width="90%" className="mb-1" />
            <Skeleton height={12} width="50%" />
            {showBadge && <SkeletonBadge className="mt-3" width={70} />}
          </div>
          {showActions && (
            <div className="p-4 flex items-center">
              <Skeleton variant="circular" width={32} height={32} />
            </div>
          )}
        </div>
      );
    }

    if (variant === "compact") {
      return (
        <div
          ref={ref}
          className={cn(
            "overflow-hidden rounded-sm border border-border bg-white p-4",
            className
          )}
          {...props}
        >
          <div className="flex items-start gap-3">
            {showAvatar && <SkeletonAvatar size="md" />}
            <div className="flex-1 min-w-0">
              <Skeleton height={14} width="60%" className="mb-2" />
              <Skeleton height={12} width="80%" />
            </div>
            {showBadge && <SkeletonBadge width={60} />}
          </div>
        </div>
      );
    }

    // Default variant
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-md border border-border bg-white",
          className
        )}
        {...props}
      >
        {showImage && (
          <SkeletonImage aspectRatio={imageAspectRatio} className="rounded-none" />
        )}
        <div className="p-5">
          {showAvatar && (
            <div className="flex items-center gap-3 mb-4">
              <SkeletonAvatar size="sm" />
              <div className="flex-1">
                <Skeleton height={12} width="40%" className="mb-1" />
                <Skeleton height={10} width="25%" />
              </div>
            </div>
          )}
          <Skeleton height={18} width="75%" className="mb-3" />
          <SkeletonText lines={2} lastLineWidth="80%" spacing="sm" />
          {showBadge && (
            <div className="flex gap-2 mt-4">
              <SkeletonBadge width={60} />
              <SkeletonBadge width={70} />
            </div>
          )}
          {showActions && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-border">
              <SkeletonButton size="sm" width={80} />
              <SkeletonButton size="sm" width={80} />
            </div>
          )}
        </div>
      </div>
    );
  }
);
SkeletonCard.displayName = "SkeletonCard";

// Stats Card Skeleton
export interface SkeletonStatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  showIcon?: boolean;
  showTrend?: boolean;
}

const SkeletonStatsCard = React.forwardRef<HTMLDivElement, SkeletonStatsCardProps>(
  ({ className, showIcon = true, showTrend = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-md border border-border bg-white p-5",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          <Skeleton height={12} width={100} />
          {showIcon && <Skeleton variant="circular" width={40} height={40} />}
        </div>
        <Skeleton height={32} width={120} className="mb-2" />
        {showTrend && (
          <div className="flex items-center gap-2">
            <Skeleton height={12} width={50} />
            <Skeleton height={12} width={80} />
          </div>
        )}
      </div>
    );
  }
);
SkeletonStatsCard.displayName = "SkeletonStatsCard";

// Profile Card Skeleton
export interface SkeletonProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  showCover?: boolean;
  showStats?: boolean;
}

const SkeletonProfileCard = React.forwardRef<HTMLDivElement, SkeletonProfileCardProps>(
  ({ className, showCover = true, showStats = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-md border border-border bg-white",
          className
        )}
        {...props}
      >
        {showCover && <Skeleton height={100} className="rounded-none" />}
        <div className="px-5 pb-5">
          <div className={cn("flex flex-col items-center", showCover && "-mt-10")}>
            <SkeletonAvatar
              size="xl"
              className={cn(showCover && "ring-4 ring-white")}
            />
            <Skeleton height={18} width={140} className="mt-3 mb-1" />
            <Skeleton height={12} width={100} />
          </div>
          {showStats && (
            <div className="flex justify-center gap-8 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <Skeleton height={18} width={30} className="mx-auto mb-1" />
                <Skeleton height={10} width={50} />
              </div>
              <div className="text-center">
                <Skeleton height={18} width={30} className="mx-auto mb-1" />
                <Skeleton height={10} width={50} />
              </div>
              <div className="text-center">
                <Skeleton height={18} width={30} className="mx-auto mb-1" />
                <Skeleton height={10} width={50} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
SkeletonProfileCard.displayName = "SkeletonProfileCard";

export { SkeletonCard, SkeletonStatsCard, SkeletonProfileCard };
