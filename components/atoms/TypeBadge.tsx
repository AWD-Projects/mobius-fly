import * as React from "react";
import { cn } from "@/lib/utils";

export type TypeBadgeVariant = "default" | "info" | "neutral";

export interface TypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TypeBadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<TypeBadgeVariant, string> = {
  default: "bg-[#eff6ff] text-[#0c4a6e]",
  info: "bg-[#eff6ff] text-[#0c4a6e]",
  neutral: "bg-neutral/30 text-text",
};

const TypeBadge = React.forwardRef<HTMLSpanElement, TypeBadgeProps>(
  ({ variant = "default", children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded px-2 py-1 text-[11px] font-medium",
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
