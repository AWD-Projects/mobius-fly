import * as React from "react";
import { m } from "framer-motion";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { FlightSearchCard, type FlightSearchParams } from "@/components/organisms/FlightSearchCard";

interface FlightSearchSectionProps {
  sectionPadding: string;
  onSearch?: (params: FlightSearchParams) => void;
  airports?: { code: string; name: string; city: string }[];
}

export const FlightSearchSection = React.memo<FlightSearchSectionProps>(({
  sectionPadding,
  onSearch,
  airports: airportsProp,
}) => {
  const [airports, setAirports] = React.useState<{ code: string; name: string; city: string }[]>(airportsProp ?? []);
  const [tripType, setTripType] = React.useState<"roundtrip" | "oneway">("roundtrip");
  const [originCode, setOriginCode] = React.useState("NLU");
  const [destinationCode, setDestinationCode] = React.useState("CUN");

  React.useEffect(() => {
    if (airportsProp && airportsProp.length > 0) return;
    fetch("/api/airports")
      .then((r) => r.json())
      .then((data) => setAirports(data))
      .catch(() => {});
  }, [airportsProp]);
  const [departureDate, setDepartureDate] = React.useState("");
  const [returnDate, setReturnDate] = React.useState("");
  const [passengers, setPassengers] = React.useState(1);

  const todayISO = new Date().toISOString().split("T")[0];

  const canSearch =
    !!originCode &&
    !!destinationCode &&
    !!departureDate &&
    departureDate >= todayISO &&
    (tripType === "oneway" || (!!returnDate && returnDate >= departureDate));

  const handleSearch = () => {
    if (!canSearch) return;
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

        {/* Flight Search Card — onSearch NOT passed to preserve original layout */}
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
            airports={airports}
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
              disabled={!canSearch}
              className="hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed rounded-sm px-5 py-2 text-small font-semibold"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#ffffff",
              }}
            >
              Buscar vuelos
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
