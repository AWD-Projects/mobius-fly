import React from 'react';
import { Download } from 'lucide-react';

export interface SummaryStats {
  total: number;
  sold: number;
  available: number;
  pricePerSeat: string;
  currency: string;
}

export interface PassengerInfo {
  name: string;
  seat?: string;
}

export interface AdminControlCardProps {
  /** Summary stats */
  summary: SummaryStats;
  /** Passenger list */
  passengers: PassengerInfo[];
  /** Primary action text */
  primaryActionText?: string;
  /** Secondary action text */
  secondaryActionText?: string;
  /** Download manifest handler */
  onDownloadManifest?: () => void;
  /** Primary action handler */
  onPrimaryAction?: () => void;
  /** Secondary action handler */
  onSecondaryAction?: () => void;
}

export const AdminControlCard: React.FC<AdminControlCardProps> = ({
  summary,
  passengers,
  primaryActionText = 'Marcar como En vuelo',
  secondaryActionText = 'Editar vuelo',
  onDownloadManifest,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden flex flex-col">
      {/* Summary Section */}
      <div className="px-6 py-6 border-b border-[#E5E5E5] flex flex-col gap-4">
        <h3 className="text-[#0A0A0A] text-[13px] font-semibold">
          Resumen de ocupación
        </h3>
        <div className="flex gap-4">
          <div className="flex-1 bg-[#FAFAFA] rounded-md p-4 flex flex-col gap-1">
            <span className="text-[#0A0A0A] text-[28px] font-medium leading-none">
              {summary.total}
            </span>
            <span className="text-[#999999] text-[11px] font-medium">
              Asientos totales
            </span>
          </div>
          <div className="flex-1 bg-[#FAFAFA] rounded-md p-4 flex flex-col gap-1">
            <span className="text-[#2E7D32] text-[28px] font-medium leading-none">
              {summary.sold}
            </span>
            <span className="text-[#999999] text-[11px] font-medium">
              Vendidos
            </span>
          </div>
          <div className="flex-1 bg-[#FAFAFA] rounded-md p-4 flex flex-col gap-1">
            <span className="text-[#0A0A0A] text-[28px] font-medium leading-none">
              {summary.available}
            </span>
            <span className="text-[#999999] text-[11px] font-medium">
              Disponibles
            </span>
          </div>
        </div>
        <div className="bg-[#FAFAFA] rounded-md px-4 py-3 flex items-center justify-between">
          <span className="text-[#666666] text-[13px] font-normal">
            Precio por asiento
          </span>
          <span className="text-[#0A0A0A] text-[15px] font-semibold">
            {summary.pricePerSeat} {summary.currency}
          </span>
        </div>
      </div>

      {/* Manifest Section */}
      <div className="px-6 py-6 border-b border-[#E5E5E5] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[#0A0A0A] text-[13px] font-semibold">Pasajeros</h3>
          <div className="bg-[#F5F5F5] rounded px-2 py-1">
            <span className="text-[#666666] text-[11px] font-medium">
              {passengers.length} de {summary.total}
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          {passengers.map((passenger, index) => {
            const isLast = index === passengers.length - 1;
            return (
              <div
                key={index}
                className={`flex items-center justify-between py-3 ${
                  !isLast ? 'border-b border-[#F0F0F0]' : ''
                }`}
              >
                <span className="text-[#0A0A0A] text-xs font-medium">
                  {passenger.name}
                </span>
                {passenger.seat && (
                  <span className="text-[#666666] text-xs font-normal">
                    {passenger.seat}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={onDownloadManifest}
          className="flex items-center justify-center gap-1.5 pt-3"
        >
          <Download className="w-3.5 h-3.5 text-[#666666]" strokeWidth={2} />
          <span className="text-[#666666] text-xs font-medium">
            Descargar manifiesto PDF
          </span>
        </button>
      </div>

      {/* Actions Section */}
      <div className="px-6 py-6 flex flex-col gap-4">
        <h3 className="text-[#0A0A0A] text-[13px] font-semibold">Acciones</h3>
        <button
          onClick={onPrimaryAction}
          className="w-full h-12 bg-[#0A0A0A] text-white text-sm font-medium rounded-xl hover:bg-[#1a1a1a] transition-colors"
        >
          {primaryActionText}
        </button>
        <button
          onClick={onSecondaryAction}
          className="w-full h-12 border border-[#E5E5E5] text-[#666666] text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          {secondaryActionText}
        </button>
      </div>
    </div>
  );
};
