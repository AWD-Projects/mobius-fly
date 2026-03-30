import * as React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { StatusBadge, type StatusBadgeVariant } from "@/components/molecules/StatusBadge";
import { cn } from "@/lib/utils";

export interface CrewMemberHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string;
  name: string;
  role: string;
  status?: StatusBadgeVariant;
  statusLabel?: string;
  avatarColor?: string;
  avatarBgColor?: string;
}

const CrewMemberHeader = React.forwardRef<HTMLDivElement, CrewMemberHeaderProps>(
  (
    {
      initials,
      name,
      role,
      status = "active",
      statusLabel,
      avatarColor,
      avatarBgColor,
      className,
      ...props
    },
    ref
  ) => {
    // Default status labels in Spanish
    const defaultStatusLabels: Record<StatusBadgeVariant, string> = {
      active: "Activo",
      inactive: "Inactivo",
      pending: "Pendiente",
      scheduled: "Programado",
      "in-review": "En revision",
      approved: "Aprobado",
      rejected: "Rechazado",
      completed: "Finalizado",
      "on-time": "A tiempo",
      success: "Activo",
      warning: "Pendiente",
      error: "Rechazado",
      info: "Info",
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {/* Avatar and Name */}
        <div className="flex items-center gap-3">
          <Avatar
            initials={initials}
            size="xl"
            color={avatarColor}
            bgColor={avatarBgColor}
          />
          <span className="text-h3 font-semibold text-text">
            {name}
          </span>
        </div>

        {/* Role and Status */}
        <div className="flex items-center gap-3">
          <span className="text-small font-medium text-muted">{role}</span>
          <StatusBadge status={status}>
            {statusLabel || defaultStatusLabels[status]}
          </StatusBadge>
        </div>
      </div>
    );
  }
);

CrewMemberHeader.displayName = "CrewMemberHeader";

export { CrewMemberHeader };
