import React from 'react';

export interface FlightRow {
  route: string;
  date: string;
  aircraft: string;
  status: string;
  statusVariant: 'confirmed' | 'pending' | 'cancelled';
}

export interface CrewFlightsAssignedCardProps {
  /** Card title */
  title?: string;
  /** Array of flight rows */
  flights: FlightRow[];
}

const statusStyles = {
  confirmed: { bg: 'bg-[#E8F5E9]', text: 'text-[#2E7D32]', dot: 'bg-[#2E7D32]' },
  pending: { bg: 'bg-[#FFF8E1]', text: 'text-[#F57C00]', dot: 'bg-[#F57C00]' },
  cancelled: { bg: 'bg-[#FFEBEE]', text: 'text-[#C62828]', dot: 'bg-[#C62828]' },
};

export const CrewFlightsAssignedCard: React.FC<CrewFlightsAssignedCardProps> = ({
  title = 'Vuelos asignados',
  flights,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4">
      {/* Header */}
      <h3 className="text-[#0A0A0A] text-sm font-semibold">{title}</h3>

      {/* Table Head */}
      <div className="bg-[#FAFAFA] border-b border-[#E5E5E5] px-6 py-3.5 flex items-center">
        <div className="flex-1 text-[#666666] text-xs font-medium">Ruta</div>
        <div className="flex-1 text-[#666666] text-xs font-medium">Fecha</div>
        <div className="flex-1 text-[#666666] text-xs font-medium">Aeronave</div>
        <div className="flex-1 text-[#666666] text-xs font-medium">Estado</div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col">
        {flights.map((flight, index) => {
          const statusStyle = statusStyles[flight.statusVariant];
          const isLast = index === flights.length - 1;

          return (
            <div
              key={index}
              className={`flex items-center px-6 py-4.5 ${!isLast ? 'border-b border-[#F0F0F0]' : ''}`}
            >
              <div className="flex-1 text-[#0A0A0A] text-[13px] font-medium">
                {flight.route}
              </div>
              <div className="flex-1 text-[#666666] text-[13px] font-normal">
                {flight.date}
              </div>
              <div className="flex-1 text-[#666666] text-[13px] font-normal">
                {flight.aircraft}
              </div>
              <div className="flex-1">
                <div className={`${statusStyle.bg} rounded-md px-3 py-1 inline-flex items-center gap-1.5`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                  <span className={`${statusStyle.text} text-xs font-medium`}>
                    {flight.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
