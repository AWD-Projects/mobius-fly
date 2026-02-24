import * as React from "react";
import { m } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { FlightSearchCard } from "@/components/organisms/FlightSearchCard";

interface FlightSearchSectionProps {
  sectionPadding: string;
  flightTripType: "roundtrip" | "oneway";
  onTripTypeChange: (type: "roundtrip" | "oneway") => void;
}

export const FlightSearchSection = React.memo<FlightSearchSectionProps>(({
  sectionPadding,
  flightTripType,
  onTripTypeChange,
}) => {
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
            tripType={flightTripType}
            onTripTypeChange={onTripTypeChange}
            originCode="COK"
            destinationCode="BLR"
            departureDate="15 dec"
            passengers={2}
          />
        </m.div>

        {/* Search Button */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.8 }}
          className="w-full sm:w-auto"
        >
          <Button
            size="lg"
            className="gap-2 w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5"
            style={{
              backgroundColor: "#C4A77D",
              color: "#ffffff",
              fontWeight: 500,
            }}
          >
            <Search size={18} className="sm:w-5 sm:h-5" />
            Buscar vuelos
          </Button>
        </m.div>

        {/* Trust badges */}
        <m.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.8 }}
          className="text-center text-xs sm:text-sm px-4"
          style={{
            color: "#39424E",
            fontWeight: 400,
          }}
        >
          Vuelos verificados · Pagos seguros · Sin membresías
        </m.p>
      </div>
    </section>
  );
});

FlightSearchSection.displayName = "FlightSearchSection";
