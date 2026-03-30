"use client";

import * as React from "react";
import { m } from "framer-motion";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { FlightSearchCard, type FlightSearchParams } from "@/components/organisms/FlightSearchCard";
import { getAirports } from "@/app/actions/flights";
import type { Airport as AppAirport } from "@/types/app.types";

// FlightSearchCard expects { code, name, city } — map from AppAirport
function toCardAirport(a: AppAirport) {
  return { code: a.iata_code, name: a.name, city: a.city };
}

interface FlightSearchSectionProps {
  sectionPadding: string;
  onSearch?: (params: FlightSearchParams) => void;
}

export const FlightSearchSection = React.memo<FlightSearchSectionProps>(({
  sectionPadding,
  onSearch,
}) => {
  const [tripType, setTripType] = React.useState<"roundtrip" | "oneway">("roundtrip");
  const [originCode, setOriginCode] = React.useState("NLU");
  const [destinationCode, setDestinationCode] = React.useState("CUN");
  const [departureDate, setDepartureDate] = React.useState("");
  const [returnDate, setReturnDate] = React.useState("");
  const [passengers, setPassengers] = React.useState(1);
  const [airports, setAirports] = React.useState<ReturnType<typeof toCardAirport>[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const todayISO = new Date().toISOString().split("T")[0];

  // Load airports from Supabase on mount
  React.useEffect(() => {
    getAirports().then((data) => {
      setAirports(data.map(toCardAirport));
    });
  }, []);

  // Reset loading state if the user navigates back to this page
  React.useEffect(() => {
    setIsSearching(false);
  }, []);

  const canSearch =
    !!originCode &&
    !!destinationCode &&
    originCode !== destinationCode &&
    !!departureDate &&
    departureDate >= todayISO &&
    (tripType === "oneway" || (!!returnDate && returnDate >= departureDate));

  const handleSearch = () => {
    if (!canSearch || isSearching) return;
    setIsSearching(true);
    onSearch?.({
      tripType,
      originCode,
      destinationCode,
      departureDate,
      returnDate: tripType === "roundtrip" ? returnDate : undefined,
      passengers,
    });
  };

  return (
    <section
      id="vuelos"
      className={`snap-start h-screen relative flex flex-col justify-center ${sectionPadding}`}
      style={{ backgroundColor: "#F6F6F4" }}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 sm:gap-10 md:gap-12">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.8 }}
        >
          <SectionHeader
            title="Encuentra tu vuelo ideal"
            subtitle="Selecciona ruta, fecha y pasajeros"
            align="center"
            size="page"
          />
        </m.div>

        {/* Flight Search Card */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.8 }}
          className="flex flex-col items-center gap-4 w-full"
        >
          <FlightSearchCard
            tripType={tripType}
            originCode={originCode}
            destinationCode={destinationCode}
            departureDate={departureDate}
            returnDate={returnDate}
            passengers={passengers}
            airports={airports.length > 0 ? airports : undefined}
            minDepartureDate={todayISO}
            minReturnDate={departureDate || todayISO}
            onTripTypeChange={setTripType}
            onOriginChange={setOriginCode}
            onDestinationChange={setDestinationCode}
            onDepartureDateChange={setDepartureDate}
            onReturnDateChange={setReturnDate}
            onPassengersChange={setPassengers}
            onSwapClick={() => {
              setOriginCode(destinationCode);
              setDestinationCode(originCode);
            }}
          />

          {/* Search button lives outside the card to preserve card layout */}
          {onSearch && (
            <button
              onClick={handleSearch}
              disabled={!canSearch || isSearching}
              className="relative flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed rounded-sm px-5 py-2 text-small font-semibold min-w-[140px]"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#ffffff",
              }}
            >
              {isSearching ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Buscando...
                </>
              ) : (
                "Buscar vuelos"
              )}
            </button>
          )}
        </m.div>

        {/* Trust badges */}
        <m.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.8 }}
          className="text-center text-xs sm:text-sm px-4"
          style={{ color: "#39424E", fontWeight: 400 }}
        >
          Vuelos verificados · Pagos seguros · Sin membresías
        </m.p>
      </div>
    </section>
  );
});

FlightSearchSection.displayName = "FlightSearchSection";
