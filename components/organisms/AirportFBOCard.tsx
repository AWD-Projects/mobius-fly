import React from 'react';

export interface AirportInfo {
  airport: string;
  address: string;
  fbo: string;
}

export interface AirportFBOCardProps {
  /** Card title */
  title?: string;
  /** Departure airport info */
  departure: AirportInfo;
  /** Arrival airport info */
  arrival: AirportInfo;
}

export const AirportFBOCard: React.FC<AirportFBOCardProps> = ({
  title = 'Aeropuertos y FBO',
  departure,
  arrival,
}) => {
  return (
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-4">
      {/* Title */}
      <h3 className="text-text text-body font-semibold">{title}</h3>

      {/* Departure Section */}
      <div className="flex flex-col gap-2">
        <span className="text-muted text-caption font-medium">
          Aeropuerto de salida
        </span>
        <span className="text-text text-small font-normal w-full">
          {departure.airport}
        </span>

        <span className="text-muted text-caption font-medium mt-2">
          Direccion
        </span>
        <span className="text-text text-small font-normal w-full">
          {departure.address}
        </span>

        <span className="text-muted text-caption font-medium mt-2">
          FBO de salida
        </span>
        <span className="text-text text-small font-normal w-full">
          {departure.fbo}
        </span>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border" />

      {/* Arrival Section */}
      <div className="flex flex-col gap-2">
        <span className="text-muted text-caption font-medium">
          Aeropuerto de llegada
        </span>
        <span className="text-text text-small font-normal w-full">
          {arrival.airport}
        </span>

        <span className="text-muted text-caption font-medium mt-2">
          Direccion
        </span>
        <span className="text-text text-small font-normal w-full">
          {arrival.address}
        </span>

        <span className="text-muted text-caption font-medium mt-2">
          FBO de llegada
        </span>
        <span className="text-text text-small font-normal w-full">
          {arrival.fbo}
        </span>
      </div>
    </div>
  );
};
