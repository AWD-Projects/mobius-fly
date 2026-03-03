import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AirportInfo {
  code: string;
  city: string;
  airport: string;
}

export interface FlightRouteProps extends React.HTMLAttributes<HTMLDivElement> {
  origin: AirportInfo;
  destination: AirportInfo;
}

const FlightRoute = React.forwardRef<HTMLDivElement, FlightRouteProps>(
  ({ origin, destination, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-6 w-full",
          className
        )}
        {...props}
      >
        {/* Origin */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-h3 font-bold text-text leading-none">
            {origin.code}
          </span>
          <span className="text-small font-normal text-muted">
            {origin.city}
          </span>
          <span className="text-caption font-normal text-neutral">
            {origin.airport}
          </span>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center w-[60px]">
          <ArrowRight className="h-8 w-8 text-neutral" aria-hidden="true" />
        </div>

        {/* Destination */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-h3 font-bold text-text leading-none">
            {destination.code}
          </span>
          <span className="text-small font-normal text-muted">
            {destination.city}
          </span>
          <span className="text-caption font-normal text-neutral">
            {destination.airport}
          </span>
        </div>
      </div>
    );
  }
);

FlightRoute.displayName = "FlightRoute";

export { FlightRoute };
