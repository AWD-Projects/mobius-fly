"use client";

import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { SelectionCard } from "@/components/molecules/SelectionCard";
import { NumericCounter } from "@/components/molecules/NumericCounter";

function fmtPrice(n: number): string {
    return n.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export interface FlightPurchaseSidebarCardProps {
    pricePerSeat: number;
    priceFullAircraft: number;
    availableSeats: number;
    totalSeats: number;
    initialPassengers?: number;
    currency?: string;
    onContinue: (
        purchaseType: "seats" | "full_aircraft",
        totalPassengers: number,
        totalPrice: number,
        adults: number,
        minors: number
    ) => void;
}

export const FlightPurchaseSidebarCard: React.FC<FlightPurchaseSidebarCardProps> = ({
    pricePerSeat,
    priceFullAircraft,
    availableSeats,
    totalSeats,
    initialPassengers = 1,
    currency = "MXN",
    onContinue,
}) => {
    const [purchaseType, setPurchaseType] = React.useState<"seats" | "full_aircraft" | null>(null);
    const [adults, setAdults] = React.useState(Math.min(initialPassengers, availableSeats || 1));
    const [minors, setMinors] = React.useState(0);

    const isFullAircraftAvailable = availableSeats === totalSeats;

    const totalPax = purchaseType === "full_aircraft" ? totalSeats : adults + minors;

    const totalPrice =
        purchaseType === "full_aircraft"
            ? priceFullAircraft
            : pricePerSeat * totalPax;

    const seatsValid = purchaseType === "full_aircraft" || totalPax <= availableSeats;
    const canContinue = purchaseType !== null && adults >= 1 && seatsValid;

    const handleContinue = () => {
        if (!canContinue) return;
        const pax = purchaseType === "full_aircraft" ? totalSeats : totalPax;
        onContinue(purchaseType!, pax, totalPrice, adults, minors);
    };

    return (
        <div className="w-full bg-surface rounded-md border border-border p-5 flex flex-col gap-5">
            <h3 className="text-body font-semibold text-text">Opciones de compra</h3>

            {/* Type selection */}
            <div className="flex flex-col gap-3">
                <SelectionCard
                    title="Por asientos"
                    description={`Desde $${fmtPrice(pricePerSeat)} ${currency}`}
                    isSelected={purchaseType === "seats"}
                    onClick={() => setPurchaseType("seats")}
                    className="p-4 sm:p-4"
                />
                {isFullAircraftAvailable && (
                    <SelectionCard
                        title="Avión completo"
                        description={`$${fmtPrice(priceFullAircraft)} ${currency}`}
                        isSelected={purchaseType === "full_aircraft"}
                        onClick={() => setPurchaseType("full_aircraft")}
                        className="p-4 sm:p-4"
                    />
                )}
            </div>

            {/* Adults / minors */}
            {purchaseType !== null && (
                <div className="flex flex-col gap-3">
                    <div className="w-full h-px bg-border" />
                    <NumericCounter
                        label="Adultos (18+ años)"
                        value={adults}
                        onChange={(n) => setAdults(n)}
                        min={1}
                        max={purchaseType === "full_aircraft" ? totalSeats : availableSeats - minors}
                    />
                    <NumericCounter
                        label="Menores de edad"
                        value={minors}
                        onChange={(n) => setMinors(n)}
                        min={0}
                        max={purchaseType === "full_aircraft" ? totalSeats - 1 : availableSeats - adults}
                    />
                    {purchaseType === "seats" && !seatsValid && (
                        <p className="text-caption text-warning">
                            Solo hay {availableSeats} asiento{availableSeats !== 1 ? "s" : ""} disponible{availableSeats !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>
            )}

            {/* Total */}
            {purchaseType && (
                <div className="flex flex-col gap-1">
                    <div className="w-full h-px bg-border" />
                    <span className="text-caption text-muted font-medium mt-2">
                        {purchaseType === "seats"
                            ? `Total (${totalPax} asiento${totalPax !== 1 ? "s" : ""})`
                            : `Total (avión completo · ${totalSeats} asientos)`}
                    </span>
                    <span className="text-h3 font-bold text-text">
                        ${fmtPrice(totalPrice)}{" "}
                        <span className="text-small font-normal text-muted">{currency}</span>
                    </span>
                </div>
            )}

            <Button
                variant="secondary"
                size="lg"
                className="w-full"
                disabled={!canContinue}
                onClick={handleContinue}
            >
                Continuar
            </Button>
        </div>
    );
};
