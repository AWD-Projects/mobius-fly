import * as React from "react";
import { cn } from "@/lib/utils";

export type TypeBadgeVariant = "default" | "info" | "neutral";

export interface TypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TypeBadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<TypeBadgeVariant, string> = {
  default: "text-muted",
  info: "text-muted",
  neutral: "text-muted",
};

const TypeBadge = React.forwardRef<HTMLSpanElement, TypeBadgeProps>(
  ({ variant = "default", children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-sm bg-background text-[12px] font-normal w-fit",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

TypeBadge.displayName = "TypeBadge";

export { TypeBadge };
