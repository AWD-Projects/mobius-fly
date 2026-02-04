import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { FlightRoute } from "@/components/molecules/FlightRoute";

const meta = {
  title: "Moleculas/FlightRoute",
  component: FlightRoute,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FlightRoute>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    origin: {
      code: "MAD",
      city: "Madrid",
      airport: "Adolfo Suárez",
    },
    destination: {
      code: "JFK",
      city: "Nueva York",
      airport: "John F. Kennedy",
    },
  },
};

export const MadridToBarcelona: Story = {
  args: {
    origin: {
      code: "MAD",
      city: "Madrid",
      airport: "Adolfo Suárez",
    },
    destination: {
      code: "BCN",
      city: "Barcelona",
      airport: "El Prat",
    },
  },
};

export const LondonToParis: Story = {
  args: {
    origin: {
      code: "LHR",
      city: "Londres",
      airport: "Heathrow",
    },
    destination: {
      code: "CDG",
      city: "París",
      airport: "Charles de Gaulle",
    },
  },
};

export const MiamiToMexico: Story = {
  args: {
    origin: {
      code: "MIA",
      city: "Miami",
      airport: "International Airport",
    },
    destination: {
      code: "MEX",
      city: "Ciudad de México",
      airport: "Benito Juárez",
    },
  },
};

export const MultipleRoutes: Story = {
  args: {
    origin: { code: "MAD", city: "Madrid", airport: "Adolfo Suárez" },
    destination: { code: "JFK", city: "Nueva York", airport: "John F. Kennedy" },
  },
  render: () => (
    <div className="flex flex-col gap-8 w-[500px]">
      <FlightRoute
        origin={{ code: "MAD", city: "Madrid", airport: "Adolfo Suárez" }}
        destination={{ code: "JFK", city: "Nueva York", airport: "John F. Kennedy" }}
      />
      <FlightRoute
        origin={{ code: "BCN", city: "Barcelona", airport: "El Prat" }}
        destination={{ code: "LHR", city: "Londres", airport: "Heathrow" }}
      />
      <FlightRoute
        origin={{ code: "MIA", city: "Miami", airport: "International" }}
        destination={{ code: "MEX", city: "México", airport: "Benito Juárez" }}
      />
    </div>
  ),
};
