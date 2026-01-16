import * as React from "react";
import { Input, InputProps } from "@/components/atoms/Input";
import { cn } from "@/lib/utils";

export interface InputGroupProps extends Omit<InputProps, "error"> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(
  ({ label, error, helperText, required, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? `input-${generatedId}`;

    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-small font-medium tracking-[0.01em] text-secondary mb-2"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <Input
          id={inputId}
          ref={ref}
          error={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-2 text-small text-error">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-2 text-small text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputGroup.displayName = "InputGroup";

export { InputGroup };
