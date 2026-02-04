import * as React from "react";
import { cn } from "@/lib/utils";

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

// Badge component for type values
const TypeBadgeValue: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span
    className={cn(
      "inline-flex px-2 py-1 rounded text-caption font-medium bg-neutral/40 text-muted",
      className
    )}
  >
    {children}
  </span>
);

export { FlightDetailsGrid, DetailItem, TypeBadgeValue };
