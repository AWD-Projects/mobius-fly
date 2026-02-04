import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials?: string;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  bgColor?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-[72px] w-[72px] text-lg",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      initials,
      src,
      alt,
      size = "md",
      color,
      bgColor,
      className,
      ...props
    },
    ref
  ) => {
    // Default colors from the design system
    const defaultColor = "var(--color-secondary)";
    const defaultBgColor = "var(--color-neutral)";

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center rounded-full font-semibold overflow-hidden",
          sizeClasses[size],
          className
        )}
        style={{
          backgroundColor: src ? undefined : (bgColor || defaultBgColor),
          color: src ? undefined : (color || defaultColor),
        }}
        {...props}
      >
        {src ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={alt || initials || "Avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
