import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionLinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  children?: React.ReactNode;
  variant?: "default" | "icon-only";
}

const ActionLink = React.forwardRef<HTMLButtonElement, ActionLinkProps>(
  ({ icon: Icon, children, variant = "default", className, ...props }, ref) => {
    const isIconOnly = variant === "icon-only" || (!children && Icon);

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center gap-2 text-[13px] font-medium text-[#666666] hover:text-[#0A0A0A] transition-colors cursor-pointer bg-transparent border-none",
          isIconOnly && "p-1 rounded hover:bg-[#F5F5F5]",
          className
        )}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {children}
      </button>
    );
  }
);

ActionLink.displayName = "ActionLink";

export { ActionLink };
