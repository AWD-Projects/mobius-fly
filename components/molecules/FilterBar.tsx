"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export interface FilterBarProps {
  filters: FilterConfig[];
  onClear?: () => void;
  clearLabel?: string;
  className?: string;
}

const FilterSelect = React.forwardRef<
  HTMLSelectElement,
  {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    className?: string;
  }
>(({ label, value, options, onChange, className }, ref) => {
  return (
    <div className={cn("flex flex-col gap-1.5 w-[140px]", className)}>
      <span className="text-caption font-semibold text-muted">{label}</span>
      <Select
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </Select>
    </div>
  );
});

FilterSelect.displayName = "FilterSelect";

const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  ({ filters, onClear, clearLabel = "Limpiar", className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-4", className)}
      >
        {filters.map((filter) => (
          <FilterSelect
            key={filter.id}
            label={filter.label}
            value={filter.value}
            options={filter.options}
            onChange={filter.onChange}
          />
        ))}
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
          >
            {clearLabel}
          </Button>
        )}
      </div>
    );
  }
);

FilterBar.displayName = "FilterBar";

export { FilterBar, FilterSelect };
