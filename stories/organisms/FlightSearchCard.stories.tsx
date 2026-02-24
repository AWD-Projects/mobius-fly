import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FlightSearchCard } from "@/components/organisms/FlightSearchCard";

const meta = {
  title: "Organismos/FlightSearchCard",
  component: FlightSearchCard,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#f5f5f5" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    tripType: {
      control: "select",
      options: ["roundtrip", "oneway"],
    },
  },
} satisfies Meta<typeof FlightSearchCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneWay: Story = {
  render: () => {
    const [tripType, setTripType] = React.useState<"roundtrip" | "oneway">("oneway");
    const [origin, setOrigin] = React.useState("COK");
    const [destination, setDestination] = React.useState("BLR");
    const [departureDate, setDepartureDate] = React.useState("15 dec");
    const [passengers, setPassengers] = React.useState(2);

    return (
      <FlightSearchCard
        tripType={tripType}
        originCode={origin}
        destinationCode={destination}
        departureDate={departureDate}
        passengers={passengers}
        onTripTypeChange={setTripType}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
        onDepartureDateChange={setDepartureDate}
        onPassengersChange={setPassengers}
        onSwapClick={() => {
          const temp = origin;
          setOrigin(destination);
          setDestination(temp);
        }}
      />
    );
  },
};

export const RoundTrip: Story = {
  render: () => {
    const [tripType, setTripType] = React.useState<"roundtrip" | "oneway">("roundtrip");
    const [origin, setOrigin] = React.useState("COK");
    const [destination, setDestination] = React.useState("BLR");
    const [departureDate, setDepartureDate] = React.useState("15 dec");
    const [returnDate, setReturnDate] = React.useState("22 dec");
    const [passengers, setPassengers] = React.useState(2);

    return (
      <FlightSearchCard
        tripType={tripType}
        originCode={origin}
        destinationCode={destination}
        departureDate={departureDate}
        returnDate={returnDate}
        passengers={passengers}
        onTripTypeChange={setTripType}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
        onDepartureDateChange={setDepartureDate}
        onReturnDateChange={setReturnDate}
        onPassengersChange={setPassengers}
        onSwapClick={() => {
          const temp = origin;
          setOrigin(destination);
          setDestination(temp);
        }}
      />
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [tripType, setTripType] = React.useState<"roundtrip" | "oneway">("oneway");
    const [origin, setOrigin] = React.useState("COK");
    const [destination, setDestination] = React.useState("BLR");
    const [departureDate, setDepartureDate] = React.useState("15 dec");
    const [returnDate, setReturnDate] = React.useState("22 dec");
    const [passengers, setPassengers] = React.useState(2);

    const handleSwap = () => {
      const temp = origin;
      setOrigin(destination);
      setDestination(temp);
    };

    return (
      <div className="space-y-6">
        <FlightSearchCard
          tripType={tripType}
          originCode={origin}
          destinationCode={destination}
          departureDate={departureDate}
          returnDate={returnDate}
          passengers={passengers}
          onTripTypeChange={setTripType}
          onOriginChange={setOrigin}
          onDestinationChange={setDestination}
          onDepartureDateChange={setDepartureDate}
          onReturnDateChange={setReturnDate}
          onPassengersChange={setPassengers}
          onSwapClick={handleSwap}
        />

        <div className="text-sm text-gray-600 space-y-1 bg-white p-4 rounded">
          <p><strong>Trip type:</strong> {tripType === "roundtrip" ? "Round Trip" : "One Way"}</p>
          <p><strong>Route:</strong> {origin} → {destination}</p>
          <p><strong>Departure:</strong> {departureDate}</p>
          {tripType === "roundtrip" && <p><strong>Return:</strong> {returnDate}</p>}
          <p><strong>Passengers:</strong> {passengers}</p>
        </div>
      </div>
    );
  },
};

export const BothVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-gray-500 mb-3 font-semibold">ONE WAY</p>
        <FlightSearchCard
          tripType="oneway"
          originCode="COK"
          destinationCode="BLR"
          departureDate="15 dec"
          passengers={2}
        />
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-3 font-semibold">ROUND TRIP</p>
        <FlightSearchCard
          tripType="roundtrip"
          originCode="COK"
          destinationCode="BLR"
          departureDate="15 dec"
          returnDate="22 dec"
          passengers={2}
        />
      </div>
    </div>
  ),
};
