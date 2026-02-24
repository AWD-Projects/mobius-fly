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
          backgroundColor: "#C4A77D",
          minHeight: "240px",
        }}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon
            size={32}
            strokeWidth={1}
            style={{ color: "#F6F6F4" }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <h3
            style={{
              color: "#F6F6F4",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "1.3",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              color: "#F6F6F4",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "1.5",
              opacity: 0.85,
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
