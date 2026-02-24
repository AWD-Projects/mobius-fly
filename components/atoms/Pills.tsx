import * as React from "react";
import { cn, fontFamily } from "@/lib/utils";

export interface Pill {
  label: string;
  value: string;
}

export interface PillsProps {
  pills: Pill[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  activeColor?: string;
  inactiveColor?: string;
  activeBgColor?: string;
}

const Pills = React.forwardRef<HTMLDivElement, PillsProps>(
  (
    {
      pills,
      value,
      onChange,
      className,
      activeColor = "#c4a77dff",
      inactiveColor = "#c4a77dff",
      activeBgColor = "#c4a77d33",
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("flex items-center", className)} style={{ gap: "16px" }}>
        {pills.map((pill, index) => {
          const isActive = value === pill.value;
          const borderRadius = index === 0 ? "8px" : "10px";

          return (
            <button
              key={pill.value}
              onClick={() => onChange?.(pill.value)}
              className="flex items-center justify-center transition-all hover:opacity-80"
              style={{
                padding: isActive ? "8px 16px" : "8px 12px",
                gap: "10px",
                borderRadius,
                border: "1px solid transparent",
                backgroundColor: isActive ? activeBgColor : "transparent",
              }}
            >
              <span
                style={{
                  fontFamily,
                  fontSize: "13px",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? activeColor : inactiveColor,
                }}
              >
                {pill.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }
);

Pills.displayName = "Pills";

export { Pills };
