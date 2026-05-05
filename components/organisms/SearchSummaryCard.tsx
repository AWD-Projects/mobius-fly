import * as React from "react";
import { ArrowRight, ArrowLeftRight, Pencil } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { TypeBadge } from "@/components/atoms/TypeBadge";

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function fmtDate(iso: string): string {
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return `${parseInt(parts[2])} ${MONTHS[parseInt(parts[1]) - 1]} ${parts[0]}`;
}

export interface SearchSummaryCardProps {
    origin: string;
    destination: string;
    originCity?: string;
    destinationCity?: string;
    date: string;
    returnDate?: string;
    type: "one_way" | "round_trip";
    passengers: number;
    onModify?: () => void;
}

export const SearchSummaryCard: React.FC<SearchSummaryCardProps> = ({
    origin,
    destination,
    originCity,
    destinationCity,
    date,
    returnDate,
    type,
    passengers,
    onModify,
}) => {
    return (
        <div className="w-full bg-surface rounded-md border border-border p-5 flex flex-col gap-4">
            <h3 className="text-caption text-muted font-semibold uppercase tracking-wide">
                Tu búsqueda
            </h3>

            {/* Route */}
            <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                    <span className="text-h3 font-bold text-text leading-none">{origin}</span>
                    {originCity && (
                        <span className="text-caption text-muted">{originCity}</span>
                    )}
                </div>
                {type === "round_trip" ? (
                    <ArrowLeftRight size={18} className="text-muted flex-shrink-0" />
                ) : (
                    <ArrowRight size={18} className="text-muted flex-shrink-0" />
                )}
                <div className="flex flex-col gap-0.5">
                    <span className="text-h3 font-bold text-text leading-none">{destination}</span>
                    {destinationCity && (
                        <span className="text-caption text-muted">{destinationCity}</span>
                    )}
                </div>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Details */}
            <div className="flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-2">
                    <span className="text-caption text-muted font-medium">Fecha ida</span>
                    <span className="text-caption text-text font-medium text-right">
                        {date ? fmtDate(date) : "—"}
                    </span>
                </div>
                {type === "round_trip" && (
                    <div className="flex items-start justify-between gap-2">
                        <span className="text-caption text-muted font-medium">Fecha vuelta</span>
                        <span className="text-caption text-text font-medium text-right">
                            {returnDate ? fmtDate(returnDate) : "—"}
                        </span>
                    </div>
                )}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-caption text-muted font-medium">Tipo de vuelo</span>
                    <TypeBadge variant="neutral">
                        {type === "round_trip" ? "Redondo" : "Sencillo"}
                    </TypeBadge>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-caption text-muted font-medium">Pasajeros</span>
                    <span className="text-caption text-text font-medium">
                        {passengers} {passengers === 1 ? "pasajero" : "pasajeros"}
                    </span>
                </div>
            </div>

            <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={onModify}
                icon={<Pencil size={14} />}
                iconPosition="start"
            >
                Modificar búsqueda
            </Button>
        </div>
    );
};
