import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
};

const Icon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ icon: IconComponent, size = "md", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center", className)}
        {...props}
      >
        <IconComponent size={sizeMap[size]} />
      </div>
    );
  }
);

Icon.displayName = "Icon";

export { Icon };
