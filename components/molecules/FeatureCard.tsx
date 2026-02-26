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
          "rounded-md p-8 flex flex-col gap-4 transition-all hover:scale-105 bg-white border border-primary min-h-[240px]",
          className
        )}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon
            size={28}
            strokeWidth={1}
            className="text-primary"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <h3
            className="text-body sm:text-lg font-semibold leading-tight text-primary tracking-tight"
          >
            {title}
          </h3>
          <p
            className="text-small font-normal leading-relaxed text-secondary opacity-70"
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
