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
          "w-full overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white",
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
          "flex items-center bg-[#FAFAFA] px-6 py-3.5 border-b border-[#E5E5E5]",
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
          !isLast && "border-b border-[#F0F0F0]",
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
          "text-xs font-medium text-[#666666]",
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
  default: "text-[13px] font-normal text-[#666666]",
  emphasis: "text-sm font-medium text-[#0A0A0A]",
  muted: "text-[13px] font-normal text-[#0A0A0A]/50",
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
