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
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4">
      {/* Title */}
      <h3 className="text-[#0A0A0A] text-base font-semibold">{title}</h3>

      {/* Departure Section */}
      <div className="flex flex-col gap-2">
        <span className="text-[#666666] text-xs font-medium">
          Aeropuerto de salida
        </span>
        <span className="text-[#0A0A0A] text-[13px] font-normal w-full">
          {departure.airport}
        </span>

        <span className="text-[#666666] text-xs font-medium mt-2">
          Dirección
        </span>
        <span className="text-[#0A0A0A] text-[13px] font-normal w-full">
          {departure.address}
        </span>

        <span className="text-[#666666] text-xs font-medium mt-2">
          FBO de salida
        </span>
        <span className="text-[#0A0A0A] text-[13px] font-normal w-full">
          {departure.fbo}
        </span>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#F0F0F0]" />

      {/* Arrival Section */}
      <div className="flex flex-col gap-2">
        <span className="text-[#666666] text-xs font-medium">
          Aeropuerto de llegada
        </span>
        <span className="text-[#0A0A0A] text-[13px] font-normal w-full">
          {arrival.airport}
        </span>

        <span className="text-[#666666] text-xs font-medium mt-2">
          Dirección
        </span>
        <span className="text-[#0A0A0A] text-[13px] font-normal w-full">
          {arrival.address}
        </span>

        <span className="text-[#666666] text-xs font-medium mt-2">
          FBO de llegada
        </span>
        <span className="text-[#0A0A0A] text-[13px] font-normal w-full">
          {arrival.fbo}
        </span>
      </div>
    </div>
  );
};
