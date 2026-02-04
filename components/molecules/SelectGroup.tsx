import * as React from "react";
import { Select, SelectProps } from "@/components/atoms/Select";
import { cn } from "@/lib/utils";

export interface SelectGroupProps extends Omit<SelectProps, "error"> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const SelectGroup = React.forwardRef<HTMLSelectElement, SelectGroupProps>(
  ({ label, error, helperText, required, className, id, children, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? `select-${generatedId}`;

    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-small font-medium tracking-[0.01em] text-secondary mb-2"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        {helperText && !error && (
          <p className="text-caption text-muted mb-2">{helperText}</p>
        )}
        <Select
          id={selectId}
          ref={ref}
          error={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {children}
        </Select>
        {error && (
          <p id={`${selectId}-error`} className="mt-2 text-small text-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);

SelectGroup.displayName = "SelectGroup";

export { SelectGroup };
