import * as React from "react";
import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pills } from "@/components/atoms/Pills";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { NumericCounter } from "@/components/molecules/NumericCounter";
import type { FlightSearchCardProps } from "@/components/organisms/FlightSearchCard";

const MONTHS = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

function formatDate(iso?: string) {
  if (!iso) return "Seleccionar";
  const parts = iso.split("-");
  if (parts.length !== 3) return "Seleccionar";
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(month) || isNaN(day) || month < 1 || month > 12) return "Seleccionar";
  return `${day} ${MONTHS[month - 1]}`;
}

const FlightSearchCardMobile = React.forwardRef<HTMLDivElement, FlightSearchCardProps>(
  (
    {
      tripType = "roundtrip",
      originCode = "NLU",
      destinationCode = "CUN",
      departureDate = "",
      returnDate = "",
      passengers = 1,
      airports = [],
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
    const [originQuery, setOriginQuery] = React.useState("");
    const [destinationQuery, setDestinationQuery] = React.useState("");
    const [internalPassengers, setInternalPassengers] = React.useState(passengers);

    const departureDateRef = React.useRef<HTMLInputElement>(null);
    const returnDateRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      const open = showOriginSelect || showDestinationSelect;
      document.body.style.overflow = open ? "hidden" : "";
      return () => { document.body.style.overflow = ""; };
    }, [showOriginSelect, showDestinationSelect]);

    const handlePassengersChange = (val: number) => {
      setInternalPassengers(val);
      onPassengersChange?.(val);
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

    const AirportDropdown = ({
      show,
      onClose,
      selected,
      exclude,
      onSelect,
      query,
      onQueryChange,
    }: {
      show: boolean;
      onClose: () => void;
      selected: string;
      exclude: string;
      onSelect: (code: string) => void;
      query: string;
      onQueryChange: (q: string) => void;
    }) => {
      if (!show) return null;
      const filtered = airports
        .filter((a) => a.code !== exclude)
        .filter((a) => {
          const q = query.toLowerCase();
          return !q || a.code.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
        });
      return (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} />
          <div
            className="absolute left-0 z-20 mt-1 rounded-sm overflow-hidden flex flex-col"
            style={{
              backgroundColor: "#FBFAF9",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
              minWidth: "220px",
              maxHeight: "300px",
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border shrink-0">
              <Search size={13} className="text-muted shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Buscar ciudad o código..."
                className="flex-1 text-small bg-transparent focus:outline-none text-text placeholder:text-muted"
              />
            </div>
            <div className="overflow-y-auto overscroll-contain">
              {filtered.map((airport) => (
                <Button
                  key={airport.code}
                  variant="ghost"
                  onClick={() => { onSelect(airport.code); onClose(); }}
                  className="w-full h-auto px-4 py-3 justify-start text-left rounded-none border-none border-b border-border"
                >
                  <div className="flex flex-col gap-0 text-left">
                    <span
                      className="text-body font-semibold"
                      style={{ color: selected === airport.code ? "var(--color-primary)" : "var(--color-text)" }}
                    >
                      {airport.code}
                    </span>
                    <span className="text-caption font-normal text-muted">
                      {airport.city} — {airport.name}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </>
      );
    };

    return (
      <div
        ref={ref}
        className={cn("w-full rounded-[15px] flex flex-col gap-0", className)}
        style={{
          backgroundColor: "#FBFAF9",
          boxShadow: "0px 12px 28px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Trip type pills */}
        <div className="px-5 pt-5 pb-4">
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

        {/* Divider */}
        <div className="h-px mx-5" style={{ backgroundColor: "#EEEBE6" }} />

        {/* Origin / Destination row */}
        <div className="px-5 pt-4 pb-4 flex items-center gap-2">
          {/* Origin */}
          <div className="relative flex-1 flex flex-col gap-0.5">
            <span className="text-small font-normal text-muted">Origen</span>
            <button
              onClick={() => { setShowOriginSelect(!showOriginSelect); setShowDestinationSelect(false); }}
              className="hover:opacity-80 transition-opacity text-left cursor-pointer leading-none"
              style={{ fontSize: "40px", fontWeight: 600, color: "var(--color-primary)" }}
            >
              {originCode}
            </button>
            <AirportDropdown
              show={showOriginSelect}
              onClose={() => { setShowOriginSelect(false); setOriginQuery(""); }}
              selected={originCode}
              exclude={destinationCode}
              onSelect={(code) => { onOriginChange?.(code); setOriginQuery(""); }}
              query={originQuery}
              onQueryChange={setOriginQuery}
            />
          </div>

          {/* Swap arrow */}
          <div className="flex-shrink-0 mt-4">
            <IconButton
              variant="ghost"
              size="sm"
              icon={<ArrowRight size={20} className="text-primary" />}
              onClick={handleSwap}
            />
          </div>

          {/* Destination */}
          <div className="relative flex-1 flex flex-col gap-0.5 items-end">
            <span className="text-small font-normal text-muted">Destino</span>
            <button
              onClick={() => { setShowDestinationSelect(!showDestinationSelect); setShowOriginSelect(false); }}
              className="hover:opacity-80 transition-opacity text-right cursor-pointer leading-none"
              style={{ fontSize: "40px", fontWeight: 600, color: "var(--color-primary)" }}
            >
              {destinationCode}
            </button>
            <div className="relative">
              <AirportDropdown
                show={showDestinationSelect}
                onClose={() => { setShowDestinationSelect(false); setDestinationQuery(""); }}
                selected={destinationCode}
                exclude={originCode}
                onSelect={(code) => { onDestinationChange?.(code); setDestinationQuery(""); }}
                query={destinationQuery}
                onQueryChange={setDestinationQuery}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mx-5" style={{ backgroundColor: "#EEEBE6" }} />

        {/* Dates + Passengers row */}
        <div className="px-5 pt-4 pb-4 flex items-start gap-4">
          {/* Salida */}
          <div className="relative flex flex-col gap-0.5">
            <span className="text-small font-normal text-muted">Salida</span>
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

          {/* Llegada — only roundtrip */}
          {tripType === "roundtrip" && (
            <div className="relative flex flex-col gap-0.5">
              <span className="text-small font-normal text-muted">Llegada</span>
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
          )}

          {/* Pasajeros — pushed to the right */}
          <div className="ml-auto flex flex-col gap-0.5 items-end">
            <span className="text-small font-normal text-muted">Pasajeros</span>
            <NumericCounter
              value={internalPassengers}
              onChange={handlePassengersChange}
              min={1}
              max={12}
            />
          </div>
        </div>

        {/* Search button */}
        {onSearch && (
          <>
            <div className="h-px mx-5" style={{ backgroundColor: "#EEEBE6" }} />
            <div className="px-5 py-4">
              <button
                onClick={handleSearch}
                disabled={!originCode || !destinationCode || !departureDate}
                className="w-full flex items-center justify-center gap-2 rounded-sm py-3 text-small font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--color-primary)", color: "#ffffff" }}
              >
                Buscar vuelos
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
);

FlightSearchCardMobile.displayName = "FlightSearchCardMobile";

export { FlightSearchCardMobile };
