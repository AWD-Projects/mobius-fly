import * as React from "react";
import { cn } from "@/lib/utils";
import { TypeBadge } from "@/components/atoms/TypeBadge";

export interface FlightDetailItem {
  label: string;
  value: string | React.ReactNode;
}

export interface FlightDetailsGridProps {
  items: FlightDetailItem[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const DetailItem: React.FC<{ item: FlightDetailItem }> = ({ item }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-caption font-medium text-muted">{item.label}</span>
    {typeof item.value === "string" ? (
      <span className="text-body font-semibold text-text">{item.value}</span>
    ) : (
      item.value
    )}
  </div>
);

const FlightDetailsGrid = React.forwardRef<HTMLDivElement, FlightDetailsGridProps>(
  ({ items, columns = 1, className }, ref) => {
    const gridColsClass = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
    }[columns];

    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4",
          columns === 1 ? "flex flex-col" : gridColsClass,
          className
        )}
      >
        {items.map((item, index) => (
          <DetailItem key={index} item={item} />
        ))}
      </div>
    );
  }
);

FlightDetailsGrid.displayName = "FlightDetailsGrid";

export { FlightDetailsGrid, DetailItem, TypeBadge as TypeBadgeValue };
