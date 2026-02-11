"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  error?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {label && (
          <label className="text-xs font-medium text-muted">{label}</label>
        )}
        <div className="relative">
          <input
            type="date"
            ref={ref}
            value={value}
            onChange={handleChange}
            className={cn(
              "flex h-10 w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-10 py-2 text-body text-text transition-all",
              "focus-visible:outline-none focus-visible:border-text focus-visible:border-2",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-neutral/40",
              error && "border-error focus-visible:border-error",
              "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            )}
            {...props}
          />
          <Calendar
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
