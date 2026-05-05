import React from 'react';
import { Repeat, CircleDot, MapPin, Building2, Clock3 } from 'lucide-react';
import { TypeBadge } from '../atoms/TypeBadge';

export interface FlightInfoCardProps {
  /** Flight type (e.g., "Sencillo", "Redondo") */
  flightType: string;
  /** Origin city and country */
  originCity: string;
  /** Origin airport name and code */
  originAirport: string;
  /** Destination city and country */
  destinationCity: string;
  /** Destination airport name and code */
  destinationAirport: string;
  /** FBO name */
  fboName: string;
  /** FBO address/location */
  fboAddress: string;
  /** Flight time range (e.g., "10:30 -> 11:15") */
  scheduleTime: string;
  /** Flight duration */
  scheduleDuration: string;
}

export const FlightInfoCard: React.FC<FlightInfoCardProps> = ({
  flightType,
  originCity,
  originAirport,
  destinationCity,
  destinationAirport,
  fboName,
  fboAddress,
  scheduleTime,
  scheduleDuration,
}) => {
  return (
    <div className="w-full bg-surface rounded-md border border-border p-7 flex flex-col gap-5">
      {/* Flight Type Row */}
      <div className="flex items-center gap-3 w-full">
        <Repeat className="w-4 h-4 text-muted" strokeWidth={1} />
        <div className="flex items-center gap-2">
          <span className="text-muted text-small font-normal">
            Tipo de vuelo
          </span>
          <TypeBadge variant="neutral">{flightType}</TypeBadge>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border" />

      {/* Origin and Destination Row */}
      <div className="flex items-start gap-8">
        {/* Origin Block */}
        <div className="flex gap-3.5 flex-1">
          <CircleDot className="w-[18px] h-[18px] text-muted flex-shrink-0 mt-0.5" strokeWidth={1} />
          <div className="flex flex-col gap-1">
            <div className="text-muted text-caption font-semibold tracking-wide uppercase">
              Origen
            </div>
            <div className="text-text text-body font-medium leading-tight">
              {originCity}
            </div>
            <div className="text-muted text-small font-normal leading-tight">
              {originAirport}
            </div>
          </div>
        </div>

        {/* Destination Block */}
        <div className="flex gap-3.5 flex-1">
          <MapPin className="w-[18px] h-[18px] text-muted flex-shrink-0 mt-0.5" strokeWidth={1} />
          <div className="flex flex-col gap-1">
            <div className="text-muted text-caption font-semibold tracking-wide uppercase">
              Destino
            </div>
            <div className="text-text text-body font-medium leading-tight">
              {destinationCity}
            </div>
            <div className="text-muted text-small font-normal leading-tight">
              {destinationAirport}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border" />

      {/* FBO and Schedule Row */}
      <div className="flex items-start gap-8">
        {/* FBO Block */}
        <div className="flex gap-3.5 flex-1">
          <Building2 className="w-[18px] h-[18px] text-muted flex-shrink-0 mt-0.5" strokeWidth={1} />
          <div className="flex flex-col gap-1">
            <div className="text-muted text-caption font-semibold tracking-wide uppercase">
              FBO de salida
            </div>
            <div className="text-text text-body font-medium leading-tight">
              {fboName}
            </div>
            <div className="text-muted text-small font-normal leading-tight">
              {fboAddress}
            </div>
          </div>
        </div>

        {/* Schedule Block */}
        <div className="flex gap-3.5 flex-1">
          <Clock3 className="w-[18px] h-[18px] text-muted flex-shrink-0 mt-0.5" strokeWidth={1} />
          <div className="flex flex-col gap-1">
            <div className="text-muted text-caption font-semibold tracking-wide uppercase">
              Horario
            </div>
            <div className="text-text text-body font-medium leading-tight">
              {scheduleTime}
            </div>
            <div className="text-muted text-small font-normal leading-tight">
              {scheduleDuration}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
