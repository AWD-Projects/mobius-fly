import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pills } from "@/components/atoms/Pills";
import { NumericCounter } from "@/components/molecules/NumericCounter";

export interface Airport {
  code: string;
  name: string;
  city: string;
}

/** Typed params passed to onSearch — ready to send to the API */
export interface FlightSearchParams {
  tripType: "roundtrip" | "oneway";
  originCode: string;
  destinationCode: string;
  departureDate: string;  // ISO: YYYY-MM-DD
  returnDate?: string;    // ISO: YYYY-MM-DD — only present for roundtrip
  passengers: number;
}

export interface FlightSearchCardProps {
  tripType?: "roundtrip" | "oneway";
  originCode?: string;
  destinationCode?: string;
  /** ISO date string: YYYY-MM-DD */
  departureDate?: string;
  /** ISO date string: YYYY-MM-DD */
  returnDate?: string;
  passengers?: number;
  airports?: Airport[];
  /** ISO date (YYYY-MM-DD) — earliest selectable departure date */
  minDepartureDate?: string;
  /** ISO date (YYYY-MM-DD) — earliest selectable return date */
  minReturnDate?: string;
  onTripTypeChange?: (type: "roundtrip" | "oneway") => void;
  onOriginChange?: (code: string) => void;
  onDestinationChange?: (code: string) => void;
  /** Receives ISO date string: YYYY-MM-DD */
  onDepartureDateChange?: (date: string) => void;
  /** Receives ISO date string: YYYY-MM-DD */
  onReturnDateChange?: (date: string) => void;
  onPassengersChange?: (passengers: number) => void;
  onSwapClick?: () => void;
  /** Called when user submits the search — receives validated params */
  onSearch?: (params: FlightSearchParams) => void;
  className?: string;
}

const FlightSearchCard = React.forwardRef<HTMLDivElement, FlightSearchCardProps>(
  (
    {
      tripType = "roundtrip",
      originCode = "COK",
      destinationCode = "BLR",
      departureDate = "",
      returnDate = "",
      passengers = 1,
      airports = [
        { code: "COK", name: "Cochin International", city: "Kochi" },
        { code: "BLR", name: "Kempegowda International", city: "Bangalore" },
        { code: "DEL", name: "Indira Gandhi International", city: "Delhi" },
        { code: "BOM", name: "Chhatrapati Shivaji", city: "Mumbai" },
        { code: "MAA", name: "Chennai International", city: "Chennai" },
      ],
      minDepartureDate,
      minReturnDate,
      onTripTypeChange,
      onOriginChange,
      onDestinationChange,
      onDepartureDateChange,
      onReturnDateChange,
      onPassengersChange,
      onSwapClick,
      onSearch,
      className,
    },
    ref
  ) => {
    const [showOriginSelect, setShowOriginSelect] = React.useState(false);
    const [showDestinationSelect, setShowDestinationSelect] = React.useState(false);
    const [internalPassengers, setInternalPassengers] = React.useState(passengers);

    const handlePassengersChange = (val: number) => {
      setInternalPassengers(val);
      onPassengersChange?.(val);
    };

    const departureDateRef = React.useRef<HTMLInputElement>(null);
    const returnDateRef = React.useRef<HTMLInputElement>(null);

    /** Format ISO date (YYYY-MM-DD) to display string (e.g. "15 dic") */
    const MONTHS = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    const formatDate = (iso?: string) => {
      if (!iso) return "Seleccionar";
      const parts = iso.split("-");
      if (parts.length !== 3) return "Seleccionar";
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (isNaN(month) || isNaN(day) || month < 1 || month > 12) return "Seleccionar";
      return `${day} ${MONTHS[month - 1]}`;
    };

    const handleSearch = () => {
      if (!originCode || !destinationCode || !departureDate) return;
      onSearch?.({
        tripType,
        originCode,
        destinationCode,
        departureDate,
        returnDate: tripType === "roundtrip" ? returnDate : undefined,
        passengers: internalPassengers,
      });
    };

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
          width: "920px",
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
          <span className="text-small font-normal text-muted">
            Origen
          </span>
        </div>

        {/* Origen Code with Select */}
        <div className="absolute" style={{ left: "45px", top: "120px" }}>
          <button
            onClick={() => setShowOriginSelect(!showOriginSelect)}
            className="hover:opacity-80 transition-opacity text-left cursor-pointer"
            style={{
              fontSize: "50px",
              fontWeight: 600,
              color: "var(--color-primary)",
            }}
          >
            {originCode}
          </button>

          {showOriginSelect && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowOriginSelect(false)} />
              <div
                className="absolute z-20 mt-2 rounded-sm overflow-hidden"
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
                    className="block w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors border-b border-border"
                  >
                    <div
                      className="text-body font-semibold"
                      style={{
                        color: originCode === airport.code ? "var(--color-primary)" : "var(--color-text)",
                      }}
                    >
                      {airport.code}
                    </div>
                    <div className="text-caption font-normal text-muted">
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
          <ArrowRight size={22} className="text-primary" />
        </button>

        {/* Destino Label */}
        <div className="absolute" style={{ left: "356px", top: "93px" }}>
          <span className="text-small font-normal text-muted">
            Destino
          </span>
        </div>

        {/* Destino Code with Select */}
        <div className="absolute" style={{ left: "357px", top: "120px" }}>
          <button
            onClick={() => setShowDestinationSelect(!showDestinationSelect)}
            className="hover:opacity-80 transition-opacity text-left cursor-pointer"
            style={{
              fontSize: "50px",
              fontWeight: 600,
              color: "var(--color-primary)",
            }}
          >
            {destinationCode}
          </button>

          {showDestinationSelect && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDestinationSelect(false)} />
              <div
                className="absolute z-20 mt-2 rounded-sm overflow-hidden"
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
                    className="block w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors border-b border-border"
                  >
                    <div
                      className="text-body font-semibold"
                      style={{
                        color: destinationCode === airport.code ? "var(--color-primary)" : "var(--color-text)",
                      }}
                    >
                      {airport.code}
                    </div>
                    <div className="text-caption font-normal text-muted">
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
          <span className="text-small font-normal text-muted">
            Salida
          </span>
        </div>

        {/* Salida Date */}
        <div className="absolute" style={{ left: "527px", top: "147px" }}>
          <input
            ref={departureDateRef}
            type="date"
            min={minDepartureDate}
            onChange={(e) => onDepartureDateChange?.(e.target.value)}
            className="opacity-0 pointer-events-none absolute"
          />
          <button
            onClick={() => departureDateRef.current?.showPicker()}
            className="hover:opacity-80 transition-opacity text-left cursor-pointer text-body font-normal"
            style={{ color: "var(--color-primary)" }}
          >
            {formatDate(departureDate)}
          </button>
        </div>

        {/* Llegada - only if roundtrip */}
        {tripType === "roundtrip" && (
          <>
            <div className="absolute" style={{ left: "642px", top: "91px" }}>
              <span className="text-small font-normal text-muted">
                Llegada
              </span>
            </div>

            <div className="absolute" style={{ left: "642px", top: "147px" }}>
              <input
                ref={returnDateRef}
                type="date"
                min={minReturnDate}
                onChange={(e) => onReturnDateChange?.(e.target.value)}
                className="opacity-0 pointer-events-none absolute"
              />
              <button
                onClick={() => returnDateRef.current?.showPicker()}
                className="hover:opacity-80 transition-opacity text-left cursor-pointer text-body font-normal"
                style={{ color: "var(--color-primary)" }}
              >
                {formatDate(returnDate)}
              </button>
            </div>
          </>
        )}

        {/* Pasajeros Label */}
        <div className="absolute" style={{ left: "755px", top: "91px" }}>
          <span className="text-small font-normal text-muted">Pasajeros</span>
        </div>

        {/* Pasajeros Counter */}
        <div className="absolute" style={{ left: "755px", top: "147px" }}>
          <NumericCounter
            value={internalPassengers}
            onChange={handlePassengersChange}
            min={1}
            max={12}
          />
        </div>
        {/* Search Button */}
        {onSearch && (
          <button
            onClick={handleSearch}
            disabled={!originCode || !destinationCode || !departureDate}
            className="absolute hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed rounded-sm px-5 py-2 text-small font-semibold"
            style={{
              right: "24px",
              bottom: "24px",
              backgroundColor: "var(--color-primary)",
              color: "#ffffff",
            }}
          >
            Buscar vuelos
          </button>
        )}
      </div>
    );
  }
);

FlightSearchCard.displayName = "FlightSearchCard";

export { FlightSearchCard };
