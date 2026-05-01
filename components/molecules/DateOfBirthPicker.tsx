"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/atoms/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/Popover";

// Internal value format: YYYY-MM-DD (ISO date, no time).
// Visible input format: DD/MM/YYYY.

export interface DateOfBirthPickerProps {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  min?: string;
  max?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

const isoToDisplay = (iso: string): string => {
  if (!iso) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return "";
  const [, y, m, d] = match;
  return `${d}/${m}/${y}`;
};

const displayToIso = (display: string): string => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(display);
  if (!match) return "";
  const [, d, m, y] = match;
  return `${y}-${m}-${d}`;
};

const isoToDate = (iso: string): Date | undefined => {
  if (!iso) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return undefined;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return isNaN(date.getTime()) ? undefined : date;
};

const dateToIso = (date: Date): string => {
  const y = date.getFullYear().toString().padStart(4, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatTyping = (raw: string): string => {
  // Keep only digits, max 8 (DDMMYYYY), then auto-insert slashes.
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const parts: string[] = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  return parts.join("/");
};

const DateOfBirthPicker = React.forwardRef<HTMLInputElement, DateOfBirthPickerProps>(
  (
    {
      id,
      name,
      value,
      defaultValue,
      onChange,
      onBlur,
      min,
      max,
      error,
      disabled,
      className,
      placeholder = "DD/MM/AAAA",
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internalIso, setInternalIso] = React.useState<string>(defaultValue ?? "");
    const iso = isControlled ? (value ?? "") : internalIso;

    const [text, setText] = React.useState<string>(isoToDisplay(iso));
    const [open, setOpen] = React.useState(false);

    // Keep the visible text in sync when the iso value changes externally
    // (e.g., react-hook-form reset, calendar selection).
    React.useEffect(() => {
      const next = isoToDisplay(iso);
      setText((prev) => (prev === next ? prev : next));
    }, [iso]);

    const commit = (nextIso: string) => {
      if (!isControlled) setInternalIso(nextIso);
      onChange?.(nextIso);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatTyping(e.target.value);
      setText(formatted);
      const parsed = displayToIso(formatted);
      // Only commit when we have a complete, parseable date.
      if (parsed) {
        commit(parsed);
      } else if (iso) {
        // User cleared/partial: clear committed value so validation reacts.
        commit("");
      }
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // On blur, snap back to the committed iso (avoid leaving "12/" visible).
      setText(isoToDisplay(iso));
      onBlur?.(e);
    };

    const handleSelect = (date: Date | undefined) => {
      if (!date) return;
      const nextIso = dateToIso(date);
      commit(nextIso);
      setText(isoToDisplay(nextIso));
      setOpen(false);
    };

    const minDate = isoToDate(min ?? "");
    const maxDate = isoToDate(max ?? "");
    const selectedDate = isoToDate(iso);
    const defaultMonth = selectedDate ?? maxDate ?? new Date();

    return (
      <div className={cn("relative w-full", className)}>
        <input
          ref={ref}
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="bday"
          placeholder={placeholder}
          value={text}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={disabled}
          aria-invalid={ariaInvalid ?? error}
          aria-describedby={ariaDescribedBy}
          maxLength={10}
          className={cn(
            "flex h-10 w-full rounded-sm border border-border bg-transparent px-3 pr-10 py-2 text-small text-text transition-all",
            "placeholder:text-muted",
            "focus-visible:outline-none focus-visible:bg-surface focus-visible:border-text focus-visible:border-2",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-neutral/40",
            error && "border-error focus-visible:border-error"
          )}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Abrir calendario"
              disabled={disabled}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-sm text-muted",
                "hover:text-text hover:bg-background focus-visible:outline-none focus-visible:text-text focus-visible:bg-background",
                "disabled:cursor-not-allowed disabled:opacity-40"
              )}
            >
              <CalendarIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              defaultMonth={defaultMonth}
              captionLayout="dropdown"
              startMonth={minDate}
              endMonth={maxDate}
              disabled={[
                ...(minDate ? [{ before: minDate }] : []),
                ...(maxDate ? [{ after: maxDate }] : []),
              ]}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

DateOfBirthPicker.displayName = "DateOfBirthPicker";

export { DateOfBirthPicker };
