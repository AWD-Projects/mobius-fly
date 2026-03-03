import * as React from "react";
import { cn } from "@/lib/utils";

export type TypeBadgeVariant = "default" | "info" | "neutral";

export interface TypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TypeBadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<TypeBadgeVariant, string> = {
  default: "bg-border text-muted",
  info: "bg-secondary/10 text-secondary",
  neutral: "bg-border text-muted",
};

const TypeBadge = React.forwardRef<HTMLSpanElement, TypeBadgeProps>(
  ({ variant = "default", children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-lg px-3 py-1 text-caption font-normal",
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
