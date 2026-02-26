"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children, position = "top" }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const positionClasses = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    return (
      <div
        className="relative inline-flex"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        ref={ref}
      >
        {children}
        {isVisible && (
          <div
            className={cn(
              "absolute z-50 px-2 py-1 text-caption font-normal tracking-[0.01em] text-secondary whitespace-nowrap",
              "bg-white border border-border rounded-md",
              "animate-in fade-in-0",
              positionClasses[position]
            )}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

export { Tooltip };
