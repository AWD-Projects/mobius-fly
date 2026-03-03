import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusBadgeVariant =
  | "active"
  | "inactive"
  | "pending"
  | "scheduled"
  | "in-review"
  | "approved"
  | "rejected"
  | "completed"
  | "on-time"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusBadgeVariant;
  children: React.ReactNode;
  showDot?: boolean;
}

const statusConfig: Record<StatusBadgeVariant, { dot: string; text: string; bg: string }> = {
  inactive: {
    dot: "bg-neutral",
    text: "text-muted",
    bg: "bg-background",
  },
  active: {
    dot: "bg-[#2E7D32]",
    text: "text-[#2E7D32]",
    bg: "bg-[#E8F5E9]",
  },
  pending: {
    dot: "bg-[#F57F17]",
    text: "text-[#F57F17]",
    bg: "bg-[#FFF8E1]",
  },
  scheduled: {
    dot: "bg-[#1565C0]",
    text: "text-[#1565C0]",
    bg: "bg-[#E3F2FD]",
  },
  "in-review": {
    dot: "bg-[#6A1B9A]",
    text: "text-[#6A1B9A]",
    bg: "bg-[#F3E5F5]",
  },
  approved: {
    dot: "bg-[#00695C]",
    text: "text-[#00695C]",
    bg: "bg-[#E0F2F1]",
  },
  rejected: {
    dot: "bg-[#C62828]",
    text: "text-[#C62828]",
    bg: "bg-[#FFEBEE]",
  },
  completed: {
    dot: "bg-[#558B2F]",
    text: "text-[#558B2F]",
    bg: "bg-[#F1F8E9]",
  },
  "on-time": {
    dot: "bg-[#00796B]",
    text: "text-[#00796B]",
    bg: "bg-[#E0F2F1]",
  },
  // Legacy variants for backwards compatibility
  success: {
    dot: "bg-[#2E7D32]",
    text: "text-[#2E7D32]",
    bg: "bg-[#E8F5E9]",
  },
  warning: {
    dot: "bg-[#F57F17]",
    text: "text-[#F57F17]",
    bg: "bg-[#FFF8E1]",
  },
  error: {
    dot: "bg-[#C62828]",
    text: "text-[#C62828]",
    bg: "bg-[#FFEBEE]",
  },
  info: {
    dot: "bg-[#1565C0]",
    text: "text-[#1565C0]",
    bg: "bg-[#E3F2FD]",
  },
};

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, children, showDot = true, className, ...props }, ref) => {
    const config = statusConfig[status];

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
          config.bg,
          config.text,
          className
        )}
        {...props}
      >
        {showDot && (
          <span
            className={cn("h-1.5 w-1.5 rounded-full", config.dot)}
            aria-hidden="true"
          />
        )}
        {children}
      </div>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

export { StatusBadge };
