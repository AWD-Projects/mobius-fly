import * as React from "react";
import { cn } from "@/lib/utils";

export interface PriceBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
  currency?: string;
  period?: string;
  description?: string;
}

const PriceBlock = React.forwardRef<HTMLDivElement, PriceBlockProps>(
  ({ amount, currency = "USD", period, description, className, ...props }, ref) => {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col", className)}
        {...props}
      >
        <div className="flex items-baseline gap-1">
          <span className="text-small text-muted">{currency}</span>
          <span className="text-h2 font-medium text-text tracking-[-0.005em]">{formattedAmount}</span>
          {period && (
            <span className="text-small text-muted">/{period}</span>
          )}
        </div>
        {description && (
          <p className="text-small text-muted mt-1">{description}</p>
        )}
      </div>
    );
  }
);

PriceBlock.displayName = "PriceBlock";

export { PriceBlock };
