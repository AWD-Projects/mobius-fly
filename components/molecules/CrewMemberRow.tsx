import * as React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { cn } from "@/lib/utils";

export interface CrewMemberRowProps {
  name: string;
  role: string;
  initials?: string;
  avatarUrl?: string;
  avatarColor?: string;
  licenseLabel?: string;
  licenseValue?: string;
  showBorder?: boolean;
  className?: string;
  onClick?: () => void;
}

const CrewMemberRow = React.forwardRef<HTMLDivElement, CrewMemberRowProps>(
  (
    {
      name,
      role,
      initials,
      avatarUrl,
      avatarColor = "#0A0A0A",
      licenseLabel = "Licencia",
      licenseValue,
      showBorder = true,
      className,
      onClick,
    },
    ref
  ) => {
    // Generate initials from name if not provided
    const displayInitials =
      initials ??
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "flex items-center justify-between py-5",
          showBorder && "border-b border-border",
          onClick && "cursor-pointer hover:bg-neutral/20 transition-colors",
          className
        )}
      >
        {/* Left side: Avatar and info */}
        <div className="flex items-center gap-4">
          <Avatar
            initials={displayInitials}
            src={avatarUrl}
            size="md"
            style={{ backgroundColor: avatarColor }}
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-body font-medium text-text">{name}</span>
            <span className="text-caption text-muted">{role}</span>
          </div>
        </div>

        {/* Right side: License info */}
        {licenseValue && (
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-caption font-medium text-muted">
              {licenseLabel}
            </span>
            <span className="text-small font-medium text-text">
              {licenseValue}
            </span>
          </div>
        )}
      </div>
    );
  }
);

CrewMemberRow.displayName = "CrewMemberRow";

export { CrewMemberRow };
