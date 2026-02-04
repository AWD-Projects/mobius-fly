import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  FlightDetailsGrid,
  TypeBadgeValue,
} from "@/components/molecules/FlightDetailsGrid";

const meta: Meta<typeof FlightDetailsGrid> = {
  title: "Molecules/FlightDetailsGrid",
  component: FlightDetailsGrid,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FlightDetailsGrid>;

export const SingleColumn: Story = {
  args: {
    items: [
      { label: "Fecha de salida", value: "15 Feb 2026 • 10:30 AM" },
      { label: "Fecha de llegada", value: "15 Feb 2026 • 08:15 PM" },
      { label: "Duracion del vuelo", value: "9 horas 45 minutos" },
      {
        label: "Tipo de vuelo",
        value: <TypeBadgeValue>Sencillo</TypeBadgeValue>,
      },
    ],
    columns: 1,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] p-4 bg-surface rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const TwoColumns: Story = {
  args: {
    items: [
      { label: "Fecha de salida", value: "15 Feb 2026 • 10:30 AM" },
      { label: "Fecha de llegada", value: "15 Feb 2026 • 08:15 PM" },
      { label: "Duracion del vuelo", value: "9 horas 45 minutos" },
      {
        label: "Tipo de vuelo",
        value: <TypeBadgeValue>Sencillo</TypeBadgeValue>,
      },
    ],
    columns: 2,
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] p-4 bg-surface rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const FourColumns: Story = {
  args: {
    items: [
      { label: "Origen", value: "Madrid (MAD)" },
      { label: "Destino", value: "Paris (CDG)" },
      { label: "Duracion", value: "2h 15min" },
      { label: "Distancia", value: "1,052 km" },
    ],
    columns: 4,
  },
  decorators: [
    (Story) => (
      <div className="w-[800px] p-4 bg-surface rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const WithBadges: Story = {
  args: {
    items: [
      { label: "Aeronave", value: "Citation CJ3+" },
      { label: "Matricula", value: "XA-ABC" },
      {
        label: "Estado",
        value: (
          <span className="inline-flex px-2 py-1 rounded text-caption font-medium bg-status-active-bg text-status-active">
            Activo
          </span>
        ),
      },
      {
        label: "Tipo",
        value: <TypeBadgeValue>Charter</TypeBadgeValue>,
      },
    ],
    columns: 2,
  },
  decorators: [
    (Story) => (
      <div className="w-[500px] p-4 bg-surface rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const PassengerInfo: Story = {
  args: {
    items: [
      { label: "Pasajeros adultos", value: "4" },
      { label: "Pasajeros menores", value: "2" },
      { label: "Equipaje total", value: "120 kg" },
      { label: "Mascotas", value: "1" },
    ],
    columns: 4,
  },
  decorators: [
    (Story) => (
      <div className="w-[700px] p-4 bg-surface rounded-lg">
        <Story />
      </div>
    ),
  ],
};
