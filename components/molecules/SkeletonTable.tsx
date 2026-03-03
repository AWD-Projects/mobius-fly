import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton, SkeletonBadge } from "@/components/atoms/Skeleton";

export interface SkeletonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  showActions?: boolean;
  columnWidths?: (number | string)[];
}

const SkeletonTable = React.forwardRef<HTMLDivElement, SkeletonTableProps>(
  (
    {
      className,
      rows = 5,
      columns = 5,
      showHeader = true,
      showActions = true,
      columnWidths,
      ...props
    },
    ref
  ) => {
    const getColumnWidth = (index: number) => {
      if (columnWidths && columnWidths[index]) {
        return columnWidths[index];
      }
      // Default widths based on position
      if (index === 0) return 200; // First column wider
      if (showActions && index === columns - 1) return 100; // Actions column
      return 120;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full overflow-hidden rounded-md border border-border bg-white",
          className
        )}
        {...props}
      >
        {/* Header */}
        {showHeader && (
          <div className="flex items-center bg-background px-6 py-3.5 border-b border-border">
            {Array.from({ length: columns }).map((_, index) => (
              <div
                key={`header-${index}`}
                style={{
                  width: getColumnWidth(index),
                  flexShrink: 0,
                  flex: index === columns - (showActions ? 2 : 1) ? 1 : undefined,
                }}
              >
                <Skeleton height={12} width="70%" />
              </div>
            ))}
          </div>
        )}

        {/* Rows */}
        <div className="flex flex-col">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className={cn(
                "flex items-center px-6 py-[18px]",
                rowIndex !== rows - 1 && "border-b border-border"
              )}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={{
                    width: getColumnWidth(colIndex),
                    flexShrink: 0,
                    flex:
                      colIndex === columns - (showActions ? 2 : 1) ? 1 : undefined,
                  }}
                >
                  {/* First column - emphasis text */}
                  {colIndex === 0 && <Skeleton height={14} width="80%" />}
                  {/* Status/Badge column */}
                  {colIndex === columns - (showActions ? 2 : 1) && (
                    <SkeletonBadge width={90} />
                  )}
                  {/* Actions column */}
                  {showActions && colIndex === columns - 1 && (
                    <div className="flex gap-2">
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="circular" width={24} height={24} />
                    </div>
                  )}
                  {/* Regular columns */}
                  {colIndex !== 0 &&
                    colIndex !== columns - 1 &&
                    colIndex !== columns - (showActions ? 2 : 1) && (
                      <Skeleton height={14} width="60%" />
                    )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
SkeletonTable.displayName = "SkeletonTable";

// Skeleton Table Row - for inline loading state
export interface SkeletonTableRowProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  isLast?: boolean;
}

const SkeletonTableRow = React.forwardRef<HTMLDivElement, SkeletonTableRowProps>(
  ({ className, columns = 5, isLast = false, ...props }, ref) => {
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
        {Array.from({ length: columns }).map((_, index) => (
          <div
            key={index}
            className="flex-1"
            style={{ maxWidth: index === 0 ? 200 : 150 }}
          >
            <Skeleton height={14} width={index === 0 ? "80%" : "60%"} />
          </div>
        ))}
      </div>
    );
  }
);
SkeletonTableRow.displayName = "SkeletonTableRow";

export { SkeletonTable, SkeletonTableRow };
