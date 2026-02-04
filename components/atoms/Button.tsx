import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md border border-transparent font-medium tracking-[0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-soft hover:shadow-hover hover:brightness-95",
        secondary:
          "bg-secondary text-white shadow-soft hover:shadow-hover hover:brightness-95",
        ghost:
          "text-text border-border hover:bg-neutral/60",
        link:
          "border-0 text-primary underline-offset-4 hover:underline",
        outline:
          "border-border bg-transparent text-text hover:bg-neutral/40",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, isLoading, icon, iconPosition = "start", children, disabled, ...props },
    ref
  ) => {
    const showIcon = isLoading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      icon
    );

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {showIcon && iconPosition === "start" ? showIcon : null}
        {children}
        {showIcon && iconPosition === "end" ? showIcon : null}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
