"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export interface NumericCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

const NumericCounter = React.forwardRef<HTMLDivElement, NumericCounterProps>(
  ({ value, onChange, min = 0, max = Infinity, step = 1, disabled, className }, ref) => {
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
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-3", className)}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDecrement}
          disabled={!canDecrement}
          aria-label="Disminuir valor"
          type="button"
        >
          <Minus size={16} />
        </Button>
        <span className="min-w-[3ch] text-center font-medium text-text">
          {value}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleIncrement}
          disabled={!canIncrement}
          aria-label="Aumentar valor"
          type="button"
        >
          <Plus size={16} />
        </Button>
      </div>
    );
  }
);

NumericCounter.displayName = "NumericCounter";

export { NumericCounter };
