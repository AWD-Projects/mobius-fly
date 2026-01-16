import * as React from "react";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { cn } from "@/lib/utils";

export interface SystemScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  code?: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

const SystemScreen = React.forwardRef<HTMLDivElement, SystemScreenProps>(
  ({ code, title, subtitle, actions, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen bg-background px-6 py-16 flex items-center justify-center",
          className
        )}
        {...props}
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 text-center">
          {code && (
            <p className="text-caption font-medium uppercase tracking-[0.25em] text-muted">
              {code}
            </p>
          )}
          <SectionHeader title={title} subtitle={subtitle} size="page" align="center" />
          {actions && <div className="flex flex-wrap justify-center gap-3">{actions}</div>}
        </div>
      </div>
    );
  }
);

SystemScreen.displayName = "SystemScreen";

export { SystemScreen };
