import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComparisonFeature {
  feature: string;
  mobius: string;
  traditional: string;
  jetCard: string;
  fullCharter: string;
}

export interface ComparisonTableProps {
  features: ComparisonFeature[];
  className?: string;
}

const ComparisonTable = React.forwardRef<HTMLDivElement, ComparisonTableProps>(
  ({ features, className }, ref) => {
    return (
      <div ref={ref} className={cn("w-full overflow-x-auto", className)}>
        <div className="min-w-[900px]">
          <div>
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-6 py-4 border-b border-border items-center">
              <div className="text-text text-small font-semibold tracking-tight">
                Caracteristica
              </div>
              <div className="text-primary text-small font-semibold tracking-tight">
                Mobius Fly
              </div>
              <div className="text-text/60 text-small font-semibold tracking-tight">
                Charter Tradicional
              </div>
              <div className="text-text/60 text-small font-semibold tracking-tight">
                Tarjeta de Jets
              </div>
              <div className="text-text/60 text-small font-semibold tracking-tight">
                Charter Completo
              </div>
            </div>

            {/* Table Body */}
            {features.map((row, index) => (
              <div
                key={index}
                className={cn(
                  "grid grid-cols-5 gap-6 py-5 items-center",
                  index !== features.length - 1 && "border-b border-border"
                )}
              >
                <div className="text-text text-small font-medium tracking-tight">
                  {row.feature}
                </div>
                <div className="flex items-center gap-2 text-primary text-small font-medium tracking-tight">
                  <Check size={16} strokeWidth={1} />
                  {row.mobius}
                </div>
                <div className="text-text/70 text-small font-normal tracking-tight">
                  {row.traditional}
                </div>
                <div className="text-text/70 text-small font-normal tracking-tight">
                  {row.jetCard}
                </div>
                <div className="text-text/70 text-small font-normal tracking-tight">
                  {row.fullCharter}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

ComparisonTable.displayName = "ComparisonTable";

export { ComparisonTable };
