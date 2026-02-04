import * as React from "react";
import { Button, ButtonProps } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export interface TableHeaderWithActionProps {
  title: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  actionVariant?: ButtonProps["variant"];
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const TableHeaderWithAction = React.forwardRef<
  HTMLDivElement,
  TableHeaderWithActionProps
>(
  (
    {
      title,
      actionLabel,
      actionIcon,
      actionVariant = "primary",
      onAction,
      className,
      children,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-8 w-full",
          className
        )}
      >
        <h3 className="text-body font-semibold text-text">{title}</h3>

        <div className="flex items-center gap-3">
          {children}
          {actionLabel && (
            <Button
              variant={actionVariant}
              size="sm"
              icon={actionIcon}
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }
);

TableHeaderWithAction.displayName = "TableHeaderWithAction";

export { TableHeaderWithAction };
