import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn, fontFamily } from "@/lib/utils";
import { Pills } from "@/components/atoms/Pills";

export interface Airport {
  code: string;
  name: string;
  city: string;
}

export interface FlightSearchCardProps {
  tripType?: "roundtrip" | "oneway";
  originCode?: string;
  destinationCode?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
  airports?: Airport[];
  onTripTypeChange?: (type: "roundtrip" | "oneway") => void;
  onOriginChange?: (code: string) => void;
  onDestinationChange?: (code: string) => void;
  onDepartureDateChange?: (date: string) => void;
  onReturnDateChange?: (date: string) => void;
  onPassengersChange?: (passengers: number) => void;
  onSwapClick?: () => void;
  className?: string;
}

const FlightSearchCard = React.forwardRef<HTMLDivElement, FlightSearchCardProps>(
  (
    {
      tripType = "roundtrip",
      originCode = "COK",
      destinationCode = "BLR",
      departureDate = "15 dec",
      returnDate = "15 dec",
      passengers = 2,
      airports = [
        { code: "COK", name: "Cochin International", city: "Kochi" },
        { code: "BLR", name: "Kempegowda International", city: "Bangalore" },
        { code: "DEL", name: "Indira Gandhi International", city: "Delhi" },
        { code: "BOM", name: "Chhatrapati Shivaji", city: "Mumbai" },
        { code: "MAA", name: "Chennai International", city: "Chennai" },
      ],
      onTripTypeChange,
      onOriginChange,
      onDestinationChange,
      onDepartureDateChange,
      onReturnDateChange,
      onPassengersChange,
      onSwapClick,
      className,
    },
    ref
  ) => {
    const [showOriginSelect, setShowOriginSelect] = React.useState(false);
    const [showDestinationSelect, setShowDestinationSelect] = React.useState(false);
    const [showPassengerSelect, setShowPassengerSelect] = React.useState(false);

    const departureDateRef = React.useRef<HTMLInputElement>(null);
    const returnDateRef = React.useRef<HTMLInputElement>(null);

    const handleSwap = () => {
      if (onSwapClick) {
        onSwapClick();
      } else {
        const temp = originCode;
        onOriginChange?.(destinationCode);
        onDestinationChange?.(temp);
      }
    };

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={{
          width: "878px",
          height: "208px",
          borderRadius: "15px",
          backgroundColor: "#FBFAF9",
          boxShadow: "0px 12px 28px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Pills - absolute positioning */}
        <div className="absolute" style={{ left: "46px", top: "31px" }}>
          <Pills
            pills={[
              { label: "Redondo", value: "roundtrip" },
              { label: "Sencillo", value: "oneway" },
            ]}
            value={tripType}
            onChange={(value) => onTripTypeChange?.(value as "roundtrip" | "oneway")}
            activeColor="#C39C64"
            inactiveColor="#D6C4A4"
            activeBgColor="#EDE7DC"
          />
        </div>

        {/* Origen Label */}
        <div className="absolute" style={{ left: "46px", top: "93px" }}>
          <span
            style={{
              fontFamily,
              fontSize: "13px",
              fontWeight: 400,
              color: "#C9CBCD",
            }}
          >
            Origen
          </span>
        </div>

        {/* Origen Code with Select */}
        <div className="absolute" style={{ left: "45px", top: "120px" }}>
          <button
            onClick={() => setShowOriginSelect(!showOriginSelect)}
            className="hover:opacity-80 transition-opacity text-left cursor-pointer"
            style={{
              fontFamily,
              fontSize: "50px",
              fontWeight: 600,
              color: "#BF9A62",
            }}
          >
            {originCode}
          </button>

          {showOriginSelect && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowOriginSelect(false)} />
              <div
                className="absolute z-20 mt-2 rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "#FBFAF9",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                  minWidth: "250px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {airports.map((airport) => (
                  <button
                    key={airport.code}
                    onClick={() => {
                      onOriginChange?.(airport.code);
                      setShowOriginSelect(false);
                    }}
                    className="block w-full px-4 py-3 text-left hover:bg-[#EDE7DC] transition-colors"
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <div
                      style={{
                        fontFamily,
                        fontSize: "16px",
                        fontWeight: 600,
                        color: originCode === airport.code ? "#BF9A62" : "#333",
                      }}
                    >
                      {airport.code}
                    </div>
                    <div
                      style={{
                        fontFamily,
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#999",
                      }}
                    >
                      {airport.city} - {airport.name}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Arrow */}
        <button
          onClick={handleSwap}
          className="absolute hover:opacity-80 transition-opacity"
          style={{ left: "246px", top: "132px" }}
        >
          <ArrowRight size={22} style={{ color: "#C39C64" }} />
        </button>

        {/* Destino Label */}
        <div className="absolute" style={{ left: "356px", top: "93px" }}>
          <span
            style={{
              fontFamily,
              fontSize: "13px",
              fontWeight: 400,
              color: "#C9CBCD",
            }}
          >
            Destino
          </span>
        </div>

        {/* Destino Code with Select */}
        <div className="absolute" style={{ left: "357px", top: "120px" }}>
          <button
            onClick={() => setShowDestinationSelect(!showDestinationSelect)}
            className="hover:opacity-80 transition-opacity text-left cursor-pointer"
            style={{
              fontFamily,
              fontSize: "50px",
              fontWeight: 600,
              color: "#BF9A62",
            }}
          >
            {destinationCode}
          </button>

          {showDestinationSelect && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDestinationSelect(false)} />
              <div
                className="absolute z-20 mt-2 rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "#FBFAF9",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                  minWidth: "250px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {airports.map((airport) => (
                  <button
                    key={airport.code}
                    onClick={() => {
                      onDestinationChange?.(airport.code);
                      setShowDestinationSelect(false);
                    }}
                    className="block w-full px-4 py-3 text-left hover:bg-[#EDE7DC] transition-colors"
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <div
                      style={{
                        fontFamily,
                        fontSize: "16px",
                        fontWeight: 600,
                        color: destinationCode === airport.code ? "#BF9A62" : "#333",
                      }}
                    >
                      {airport.code}
                    </div>
                    <div
                      style={{
                        fontFamily,
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#999",
                      }}
                    >
                      {airport.city} - {airport.name}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Salida Label */}
        <div className="absolute" style={{ left: "528px", top: "91px" }}>
          <span
            style={{
              fontFamily,
              fontSize: "13px",
              fontWeight: 400,
              color: "#C9CBCD",
            }}
          >
            Salida
          </span>
        </div>

        {/* Salida Date */}
        <div className="absolute" style={{ left: "527px", top: "147px" }}>
          <input
            ref={departureDateRef}
            type="date"
            onChange={(e) => {
              const date = new Date(e.target.value);
              const formatted = `${date.getDate()} ${date.toLocaleDateString("es", { month: "short" })}`;
              onDepartureDateChange?.(formatted);
            }}
            className="opacity-0 pointer-events-none absolute"
          />
          <button
            onClick={() => departureDateRef.current?.showPicker()}
            className="hover:opacity-80 transition-opacity text-left cursor-pointer"
            style={{
              fontFamily,
              fontSize: "17px",
              fontWeight: 400,
              color: "#BF9A62",
            }}
          >
            {departureDate}
          </button>
        </div>

        {/* Llegada - only if roundtrip */}
        {tripType === "roundtrip" && (
          <>
            <div className="absolute" style={{ left: "642px", top: "91px" }}>
              <span
                style={{
                  fontFamily,
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#C9CBCD",
                }}
              >
                Llegada
              </span>
            </div>

            <div className="absolute" style={{ left: "642px", top: "147px" }}>
              <input
                ref={returnDateRef}
                type="date"
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const formatted = `${date.getDate()} ${date.toLocaleDateString("es", { month: "short" })}`;
                  onReturnDateChange?.(formatted);
                }}
                className="opacity-0 pointer-events-none absolute"
              />
              <button
                onClick={() => returnDateRef.current?.showPicker()}
                className="hover:opacity-80 transition-opacity text-left cursor-pointer"
                style={{
                  fontFamily,
                  fontSize: "17px",
                  fontWeight: 400,
                  color: "#BF9A62",
                }}
              >
                {returnDate}
              </button>
            </div>
          </>
        )}

        {/* Pasajeros Label */}
        <div className="absolute" style={{ left: "755px", top: "91px" }}>
          <span
            style={{
              fontFamily,
              fontSize: "13px",
              fontWeight: 400,
              color: "#C9CBCD",
            }}
          >
            Pasajeros
          </span>
        </div>

        {/* Pasajeros Select */}
        <div className="absolute" style={{ left: "755px", top: "147px" }}>
          <button
            onClick={() => setShowPassengerSelect(!showPassengerSelect)}
            className="hover:opacity-80 transition-opacity text-left cursor-pointer"
            style={{
              fontFamily,
              fontSize: "17px",
              fontWeight: 400,
              color: "#BF9A62",
            }}
          >
            {passengers}
          </button>

          {showPassengerSelect && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowPassengerSelect(false)} />
              <div
                className="absolute z-20 mt-1 rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "#FBFAF9",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                  minWidth: "60px",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      onPassengersChange?.(num);
                      setShowPassengerSelect(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-[#EDE7DC] transition-colors"
                    style={{
                      fontFamily,
                      fontSize: "15px",
                      fontWeight: 400,
                      color: passengers === num ? "#BF9A62" : "#666",
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);

FlightSearchCard.displayName = "FlightSearchCard";

export { FlightSearchCard };
