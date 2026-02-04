import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
  width?: number | string;
  height?: number | string;
  animation?: "pulse" | "wave" | "none";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = "rectangular",
      width,
      height,
      animation = "pulse",
      style,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      rectangular: "rounded-md",
      circular: "rounded-full",
      text: "rounded h-4 w-full",
    };

    const animationClasses = {
      pulse: "animate-pulse",
      wave: "skeleton-wave",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#E5E5E5]",
          variantClasses[variant],
          animationClasses[animation],
          className
        )}
        style={{
          width: width,
          height: height,
          ...style,
        }}
        aria-hidden="true"
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

// Skeleton Text - for text content
export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  lastLineWidth?: string;
  spacing?: "sm" | "md" | "lg";
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, lines = 3, lastLineWidth = "60%", spacing = "md", ...props }, ref) => {
    const spacingClasses = {
      sm: "space-y-1.5",
      md: "space-y-2.5",
      lg: "space-y-3.5",
    };

    return (
      <div ref={ref} className={cn(spacingClasses[spacing], className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            style={{
              width: index === lines - 1 ? lastLineWidth : "100%",
            }}
          />
        ))}
      </div>
    );
  }
);
SkeletonText.displayName = "SkeletonText";

// Skeleton Avatar
export interface SkeletonAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    };

    return (
      <Skeleton
        ref={ref}
        variant="circular"
        className={cn(sizeClasses[size], className)}
        {...props}
      />
    );
  }
);
SkeletonAvatar.displayName = "SkeletonAvatar";

// Skeleton Button
export interface SkeletonButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  width?: number | string;
}

const SkeletonButton = React.forwardRef<HTMLDivElement, SkeletonButtonProps>(
  ({ className, size = "md", width = 100, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 rounded-md",
      md: "h-10 rounded-md",
      lg: "h-12 rounded-md",
    };

    return (
      <Skeleton
        ref={ref}
        className={cn(sizeClasses[size], className)}
        width={width}
        {...props}
      />
    );
  }
);
SkeletonButton.displayName = "SkeletonButton";

// Skeleton Badge
export interface SkeletonBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
}

const SkeletonBadge = React.forwardRef<HTMLDivElement, SkeletonBadgeProps>(
  ({ className, width = 80, ...props }, ref) => {
    return (
      <Skeleton
        ref={ref}
        className={cn("h-6 rounded-full", className)}
        width={width}
        {...props}
      />
    );
  }
);
SkeletonBadge.displayName = "SkeletonBadge";

// Skeleton Image
export interface SkeletonImageProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: "square" | "video" | "wide" | "portrait";
  width?: number | string;
  height?: number | string;
}

const SkeletonImage = React.forwardRef<HTMLDivElement, SkeletonImageProps>(
  ({ className, aspectRatio, width, height, ...props }, ref) => {
    const aspectRatioClasses = {
      square: "aspect-square",
      video: "aspect-video",
      wide: "aspect-[2/1]",
      portrait: "aspect-[3/4]",
    };

    return (
      <Skeleton
        ref={ref}
        className={cn(
          "rounded-lg",
          aspectRatio && aspectRatioClasses[aspectRatio],
          className
        )}
        width={width}
        height={height}
        {...props}
      />
    );
  }
);
SkeletonImage.displayName = "SkeletonImage";

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonBadge,
  SkeletonImage,
};
