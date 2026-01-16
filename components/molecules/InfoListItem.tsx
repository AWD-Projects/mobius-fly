import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/utils";

export interface InfoListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  iconColor?: string;
  iconPosition?: "start" | "end";
}

const InfoListItem = React.forwardRef<HTMLDivElement, InfoListItemProps>(
  ({ icon, label, value, iconColor, iconPosition = "start", className, ...props }, ref) => {
    const iconOrder = iconPosition === "end" ? "order-2" : "order-1";
    const contentOrder = iconPosition === "end" ? "order-1" : "order-2";

    return (
      <div
        ref={ref}
        className={cn("flex items-start gap-3", className)}
        {...props}
      >
        <div className={cn("mt-0.5", iconOrder, iconColor)}>
          <Icon icon={icon} size="md" />
        </div>
        <div className={cn("flex-1", contentOrder)}>
          <p className="text-small tracking-[0.01em] text-muted">{label}</p>
          <p className="text-body text-text font-medium">{value}</p>
        </div>
      </div>
    );
  }
);

InfoListItem.displayName = "InfoListItem";

export { InfoListItem };
