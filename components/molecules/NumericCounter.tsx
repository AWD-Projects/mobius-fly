"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";

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
          <span className="text-caption font-medium text-muted">{label}</span>
        )}
        <div className="inline-flex items-center gap-3">
          <IconButton
            type="button"
            icon={<Minus size={14} className="text-text" />}
            onClick={handleDecrement}
            disabled={!canDecrement}
            variant="outline"
            size="sm"
            aria-label="Disminuir valor"
          />
          <span className="min-w-[2ch] text-center text-small font-semibold text-text">
            {value}
          </span>
          <IconButton
            type="button"
            icon={<Plus size={14} className="text-text" />}
            onClick={handleIncrement}
            disabled={!canIncrement}
            variant="outline"
            size="sm"
            aria-label="Aumentar valor"
          />
        </div>
      </div>
    );
  }
);

NumericCounter.displayName = "NumericCounter";

export { NumericCounter };
