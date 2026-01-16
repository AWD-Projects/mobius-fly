import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepperStep {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  className?: string;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, currentStep, className }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)}>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep;

            const stepClasses = cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-small font-medium transition-all border",
              isCompleted && "bg-primary text-white border-primary shadow-soft",
              isCurrent && "bg-primary/10 text-primary border-primary",
              isUpcoming && "bg-neutral/60 text-muted border-border"
            );

            const labelClasses = cn(
              "text-small font-medium",
              isCurrent && "text-primary",
              isUpcoming && "text-muted",
              isCompleted && "text-text"
            );

            const connectorClasses = cn(
              "h-0.5 flex-1 mx-2 mt-[-2.5rem] transition-colors",
              index < currentStep ? "bg-primary" : "bg-neutral/60"
            );

            return (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center flex-1">
                  <div className={stepClasses}>
                    {isCompleted ? (
                      <Check size={20} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={labelClasses}>
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="text-caption text-muted mt-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={connectorClasses} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
);

Stepper.displayName = "Stepper";

export { Stepper };
