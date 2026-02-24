import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectionCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  description: string;
  isSelected?: boolean;
}

const SelectionCard = React.forwardRef<HTMLButtonElement, SelectionCardProps>(
  ({ title, description, isSelected = false, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group p-6 sm:p-8 rounded-2xl bg-white hover:shadow-hover transition-all flex flex-col items-start gap-2 sm:gap-3 text-left border",
          isSelected
            ? "border-primary"
            : "border-border hover:border-primary",
          className
        )}
        {...props}
      >
        <h3
          className={cn(
            "transition-colors text-base sm:text-lg md:text-xl font-medium",
            isSelected
              ? "!text-primary"
              : "group-hover:!text-primary"
          )}
          style={{
            color: "#39424E",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h3>
        <p
          className={cn(
            "transition-colors text-xs sm:text-sm font-normal leading-relaxed",
            isSelected
              ? "!text-primary !opacity-100"
              : "group-hover:!text-primary group-hover:!opacity-100"
          )}
          style={{
            color: "#39424E",
            opacity: 0.7,
          }}
        >
          {description}
        </p>
      </button>
    );
  }
);

SelectionCard.displayName = "SelectionCard";

// Memoize to prevent unnecessary re-renders when parent updates
const MemoizedSelectionCard = React.memo(SelectionCard);
MemoizedSelectionCard.displayName = "SelectionCard";

export { MemoizedSelectionCard as SelectionCard };
