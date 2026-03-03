import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-sm border border-border bg-transparent px-3 py-2 text-small text-text transition-all",
          "placeholder:text-muted",
          "focus-visible:outline-none focus-visible:bg-surface focus-visible:border-text focus-visible:border-2",
          "disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-neutral/40",
          error && "border-error focus-visible:border-error",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
