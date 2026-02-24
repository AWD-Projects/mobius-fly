import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon: Icon, title, description, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-8 flex flex-col gap-4 transition-all hover:scale-105",
          className
        )}
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #C4A77D",
          minHeight: "240px",
        }}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon
            size={28}
            strokeWidth={1}
            style={{ color: "#C4A77D" }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <h3
            className="text-base sm:text-lg font-semibold leading-tight"
            style={{
              color: "#C4A77D",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h3>
          <p
            className="text-sm font-normal leading-relaxed"
            style={{
              color: "#39424E",
              opacity: 0.7,
            }}
          >
            {description}
          </p>
        </div>
      </div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

// Memoize to prevent unnecessary re-renders when parent updates
const MemoizedFeatureCard = React.memo(FeatureCard);
MemoizedFeatureCard.displayName = "FeatureCard";

export { MemoizedFeatureCard as FeatureCard };
