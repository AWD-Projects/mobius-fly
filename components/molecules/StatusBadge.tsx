import * as React from "react";
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "success" | "warning" | "error" | "info";
  children: React.ReactNode;
  showIcon?: boolean;
  iconPosition?: "start" | "end";
}

const iconMap = {
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  info: Info,
};

const statusClasses = {
  success: "bg-success text-white",
  warning: "bg-warning text-white",
  error: "bg-error text-white",
  info: "bg-neutral text-secondary",
};

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, children, showIcon = true, iconPosition = "start", className, ...props }, ref) => {
    const Icon = iconMap[status];

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-small font-medium tracking-[0.01em]",
          statusClasses[status],
          className
        )}
        {...props}
      >
        {showIcon && iconPosition === "start" ? <Icon size={14} /> : null}
        {children}
        {showIcon && iconPosition === "end" ? <Icon size={14} /> : null}
      </div>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

export { StatusBadge };
