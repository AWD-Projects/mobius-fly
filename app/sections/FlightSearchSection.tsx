import * as React from "react";
import { m } from "framer-motion";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { FlightSearchCard, type FlightSearchParams } from "@/components/organisms/FlightSearchCard";

interface FlightSearchSectionProps {
  sectionPadding: string;
  onSearch?: (params: FlightSearchParams) => void;
}

export const FlightSearchSection = React.memo<FlightSearchSectionProps>(({
  sectionPadding,
  onSearch,
}) => {
  const [tripType, setTripType] = React.useState<"roundtrip" | "oneway">("roundtrip");
  const [originCode, setOriginCode] = React.useState("COK");
  const [destinationCode, setDestinationCode] = React.useState("BLR");
  const [departureDate, setDepartureDate] = React.useState("");
  const [returnDate, setReturnDate] = React.useState("");

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
        >
          <FlightSearchCard
            tripType={tripType}
            originCode={originCode}
            destinationCode={destinationCode}
            departureDate={departureDate}
            returnDate={returnDate}
            onTripTypeChange={setTripType}
            onOriginChange={setOriginCode}
            onDestinationChange={setDestinationCode}
            onDepartureDateChange={setDepartureDate}
            onReturnDateChange={setReturnDate}
            onSwapClick={() => {
              setOriginCode(destinationCode);
              setDestinationCode(originCode);
            }}
            onSearch={onSearch}
          />
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
