"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  HTMLButtonElement,
  {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    className?: string;
  }
>(({ label, value, options, onChange, className }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("flex flex-col gap-1.5 w-[140px]", className)}>
      <span className="text-caption font-semibold text-muted">
        {label}
      </span>
      <div className="relative">
        <button
          ref={ref}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-between w-full h-9 px-2.5 rounded-lg",
            "bg-surface border border-border text-small text-text",
            "hover:border-neutral transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          )}
        >
          <span className="truncate">{selectedOption?.label ?? value}</span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {isOpen && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 py-1 bg-surface border border-border rounded-lg shadow-soft">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-2.5 py-1.5 text-left text-small transition-colors",
                  "hover:bg-neutral/40",
                  option.value === value && "bg-neutral/60 font-medium"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
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
          <button
            type="button"
            onClick={onClear}
            className={cn(
              "h-9 px-4 rounded-lg bg-neutral/40 text-small font-medium text-text",
              "hover:bg-neutral/60 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            )}
          >
            {clearLabel}
          </button>
        )}
      </div>
    );
  }
);

FilterBar.displayName = "FilterBar";

export { FilterBar, FilterSelect };
