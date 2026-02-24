import * as React from "react";
import { Check, Star } from "lucide-react";
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
            <div
              className="grid grid-cols-5"
              style={{
                gap: "24px",
                padding: "16px 0",
                borderBottom: "1px solid #E0E0DE",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontFamily: '"SF Pro Text", "SF Pro Display", -apple-system, sans-serif',
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#39424E",
                  letterSpacing: "-0.01em",
                }}
              >
                Característica
              </div>
              <div
                style={{
                  fontFamily: '"SF Pro Text", "SF Pro Display", -apple-system, sans-serif',
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#C4A77D",
                  letterSpacing: "-0.01em",
                }}
              >
                Mobius Fly
              </div>
              <div
                style={{
                  fontFamily: '"SF Pro Text", "SF Pro Display", -apple-system, sans-serif',
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#39424E",
                  letterSpacing: "-0.01em",
                  opacity: 0.6,
                }}
              >
                Charter Tradicional
              </div>
              <div
                style={{
                  fontFamily: '"SF Pro Text", "SF Pro Display", -apple-system, sans-serif',
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#39424E",
                  letterSpacing: "-0.01em",
                  opacity: 0.6,
                }}
              >
                Tarjeta de Jets
              </div>
              <div
                style={{
                  fontFamily: '"SF Pro Text", "SF Pro Display", -apple-system, sans-serif',
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#39424E",
                  letterSpacing: "-0.01em",
                  opacity: 0.6,
                }}
              >
                Charter Completo
              </div>
            </div>

            {/* Table Body */}
            {features.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-5"
                style={{
                  gap: "24px",
                  padding: "20px 0",
                  borderBottom:
                    index !== features.length - 1 ? "1px solid #E0E0DE" : "none",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: '"SF Pro Text", "SF Pro Display", -apple-system, sans-serif',
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#39424E",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {row.feature}
                </div>
                <div
                  className="flex items-center gap-2"
                  style={{
                    fontFamily: '"SF Pro Text", "SF Pro Display", -apple-system, sans-serif',
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#C4A77D",
                    letterSpacing: "-0.01em",
                  }}
                >
                  <Check size={16} strokeWidth={1} />
                  {row.mobius}
                </div>
                <div
                  style={{
                    fontFamily: '"SF Pro Text", "SF Pro Display", -apple-system, sans-serif',
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#39424E",
                    letterSpacing: "-0.01em",
                    opacity: 0.7,
                  }}
                >
                  {row.traditional}
                </div>
                <div
                  style={{
                    fontFamily: '"SF Pro Text", "SF Pro Display", -apple-system, sans-serif',
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#39424E",
                    letterSpacing: "-0.01em",
                    opacity: 0.7,
                  }}
                >
                  {row.jetCard}
                </div>
                <div
                  style={{
                    fontFamily: '"SF Pro Text", "SF Pro Display", -apple-system, sans-serif',
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#39424E",
                    letterSpacing: "-0.01em",
                    opacity: 0.7,
                  }}
                >
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
