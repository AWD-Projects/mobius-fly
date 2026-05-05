import * as React from "react";
import { cn } from "@/lib/utils";

// Table Root
export interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Table = React.forwardRef<HTMLDivElement, TableProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full overflow-hidden rounded-md border border-border bg-white",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Table.displayName = "Table";

// Table Header
export interface TableHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TableHeader = React.forwardRef<HTMLDivElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center bg-background px-6 py-3.5 border-b border-border",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TableHeader.displayName = "TableHeader";

// Table Body
export interface TableBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TableBody = React.forwardRef<HTMLDivElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col", className)} {...props}>
        {children}
      </div>
    );
  }
);
TableBody.displayName = "TableBody";

// Table Row
export interface TableRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isLast?: boolean;
}

const TableRow = React.forwardRef<HTMLDivElement, TableRowProps>(
  ({ className, children, isLast = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center px-6 py-[18px]",
          !isLast && "border-b border-border",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TableRow.displayName = "TableRow";

// Table Head Cell - Sentence case, not uppercase
export interface TableHeadProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  width?: number | string;
}

const TableHead = React.forwardRef<HTMLDivElement, TableHeadProps>(
  ({ className, children, width, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "text-caption font-medium text-muted",
          className
        )}
        style={{ width, flexShrink: 0, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TableHead.displayName = "TableHead";

// Table Cell
export interface TableCellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  width?: number | string;
  variant?: "default" | "emphasis" | "muted";
}

const variantStyles = {
  default: "text-small font-normal text-muted",
  emphasis: "text-small font-medium text-text",
  muted: "text-small font-normal text-text/50",
};

const TableCell = React.forwardRef<HTMLDivElement, TableCellProps>(
  ({ className, children, width, variant = "default", style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(variantStyles[variant], className)}
        style={{ width, flexShrink: 0, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TableCell.displayName = "TableCell";

// Table Action Cell - for action buttons/links
export interface TableActionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  width?: number | string;
}

const TableAction = React.forwardRef<HTMLDivElement, TableActionProps>(
  ({ className, children, width, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        style={{ width, flexShrink: 0, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TableAction.displayName = "TableAction";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableAction };
