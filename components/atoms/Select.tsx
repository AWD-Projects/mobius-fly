import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative w-full min-w-0">
        <select
          className={cn(
            "flex h-10 w-full min-w-0 appearance-none rounded-sm border border-border bg-surface px-3 pr-8 py-2 text-caption text-text transition-all",
            "focus-visible:outline-none focus-visible:border-text focus-visible:border-2",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-neutral/40",
            error && "border-error focus-visible:border-error",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none"
          aria-hidden="true"
        />
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
