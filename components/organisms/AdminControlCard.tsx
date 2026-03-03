import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../atoms/Button';

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
    <div className="w-full bg-surface rounded-md border border-border shadow-soft overflow-hidden flex flex-col">
      {/* Summary Section */}
      <div className="px-6 py-6 border-b border-border flex flex-col gap-4">
        <h3 className="text-text text-small font-semibold">
          Resumen de ocupacion
        </h3>
        <div className="flex gap-4">
          <div className="flex-1 bg-background rounded-sm p-4 flex flex-col gap-1">
            <span className="text-text text-h3 font-medium leading-none">
              {summary.total}
            </span>
            <span className="text-muted text-caption font-medium">
              Asientos totales
            </span>
          </div>
          <div className="flex-1 bg-background rounded-sm p-4 flex flex-col gap-1">
            <span className="text-success text-h3 font-medium leading-none">
              {summary.sold}
            </span>
            <span className="text-muted text-caption font-medium">
              Vendidos
            </span>
          </div>
          <div className="flex-1 bg-background rounded-sm p-4 flex flex-col gap-1">
            <span className="text-text text-h3 font-medium leading-none">
              {summary.available}
            </span>
            <span className="text-muted text-caption font-medium">
              Disponibles
            </span>
          </div>
        </div>
        <div className="bg-background rounded-sm px-4 py-3 flex items-center justify-between">
          <span className="text-muted text-small font-normal">
            Precio por asiento
          </span>
          <span className="text-text text-body font-semibold">
            {summary.pricePerSeat} {summary.currency}
          </span>
        </div>
      </div>

      {/* Manifest Section */}
      <div className="px-6 py-6 border-b border-border flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-text text-small font-semibold">Pasajeros</h3>
          <div className="bg-background rounded-sm px-2 py-1">
            <span className="text-muted text-caption font-medium">
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
                  !isLast ? 'border-b border-border' : ''
                }`}
              >
                <span className="text-text text-caption font-medium">
                  {passenger.name}
                </span>
                {passenger.seat && (
                  <span className="text-muted text-caption font-normal">
                    {passenger.seat}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <Button
          variant="link"
          size="sm"
          onClick={onDownloadManifest}
          icon={<Download className="w-3.5 h-3.5" strokeWidth={1} />}
          className="text-muted"
        >
          Descargar manifiesto PDF
        </Button>
      </div>

      {/* Actions Section */}
      <div className="px-6 py-6 flex flex-col gap-4">
        <h3 className="text-text text-small font-semibold">Acciones</h3>
        <Button
          variant="secondary"
          size="lg"
          onClick={onPrimaryAction}
          className="w-full"
        >
          {primaryActionText}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onSecondaryAction}
          className="w-full"
        >
          {secondaryActionText}
        </Button>
      </div>
    </div>
  );
};
