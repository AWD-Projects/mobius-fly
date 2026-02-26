"use client";

import * as React from "react";
import { LucideIcon, Plus, Plane, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  variant?: "default" | "primary";
}

export interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

const QuickActionButton: React.FC<{
  action: QuickAction;
}> = ({ action }) => {
  const Icon = action.icon;
  const isPrimary = action.variant === "primary";

  return (
    <Button
      variant={isPrimary ? "secondary" : "outline"}
      size="md"
      onClick={action.onClick}
      icon={<Icon className="h-4 w-4" />}
    >
      {action.label}
    </Button>
  );
};

const QuickActions = React.forwardRef<HTMLDivElement, QuickActionsProps>(
  ({ actions, className }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-3", className)}>
        {actions.map((action) => (
          <QuickActionButton key={action.id} action={action} />
        ))}
      </div>
    );
  }
);

QuickActions.displayName = "QuickActions";

// Pre-built common quick actions
const createDefaultFlightActions = (handlers: {
  onNewFlight?: () => void;
  onAddAircraft?: () => void;
  onAddCrew?: () => void;
}): QuickAction[] => [
  {
    id: "new-flight",
    label: "Nuevo vuelo",
    icon: Plus,
    onClick: handlers.onNewFlight,
    variant: "primary",
  },
  {
    id: "add-aircraft",
    label: "Agregar aeronave",
    icon: Plane,
    onClick: handlers.onAddAircraft,
  },
  {
    id: "add-crew",
    label: "Agregar tripulacion",
    icon: UserPlus,
    onClick: handlers.onAddCrew,
  },
];

export { QuickActions, QuickActionButton, createDefaultFlightActions };
