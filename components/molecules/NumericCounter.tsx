"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NumericCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const NumericCounter = React.forwardRef<HTMLDivElement, NumericCounterProps>(
  ({ value, onChange, min = 0, max = Infinity, step = 1, disabled, className, label }, ref) => {
    const handleDecrement = () => {
      const newValue = value - step;
      if (newValue >= min) {
        onChange(newValue);
      }
    };

    const handleIncrement = () => {
      const newValue = value + step;
      if (newValue <= max) {
        onChange(newValue);
      }
    };

    const canDecrement = value > min && !disabled;
    const canIncrement = value < max && !disabled;

    return (
      <div ref={ref} className={cn("flex flex-col gap-3", className)}>
        {label && (
          <span className="text-xs font-medium text-muted">{label}</span>
        )}
        <div className="inline-flex items-center gap-3">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={!canDecrement}
            aria-label="Disminuir valor"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md border border-border bg-neutral/30 transition-colors",
              "hover:bg-neutral/50 active:bg-neutral/60",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral/30"
            )}
          >
            <Minus size={14} className="text-text" />
          </button>
          <span className="min-w-[2ch] text-center text-sm font-semibold text-text">
            {value}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={!canIncrement}
            aria-label="Aumentar valor"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md border border-border bg-neutral/30 transition-colors",
              "hover:bg-neutral/50 active:bg-neutral/60",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral/30"
            )}
          >
            <Plus size={14} className="text-text" />
          </button>
        </div>
      </div>
    );
  }
);

NumericCounter.displayName = "NumericCounter";

export { NumericCounter };
