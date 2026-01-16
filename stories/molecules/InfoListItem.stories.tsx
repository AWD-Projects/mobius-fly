import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Plane, Calendar, MapPin, Users, Clock, CreditCard } from "lucide-react";
import { InfoListItem } from "@/components/molecules/InfoListItem";

const meta = {
  title: "Moleculas/InfoListItem",
  component: InfoListItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    iconPosition: {
      control: "radio",
      options: ["start", "end"],
    },
  },
} satisfies Meta<typeof InfoListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: Plane,
    label: "Tipo de aeronave",
    value: "Gulfstream G650",
  },
};

export const WithDate: Story = {
  args: {
    icon: Calendar,
    label: "Fecha de salida",
    value: "15 de marzo de 2024",
  },
};

export const WithLocation: Story = {
  args: {
    icon: MapPin,
    label: "Destino",
    value: "Los Angeles (LAX)",
  },
};

export const WithColor: Story = {
  args: {
    icon: Plane,
    label: "Estado del vuelo",
    value: "A tiempo",
    iconColor: "text-success",
  },
};

export const FlightDetails: Story = {
  args: {
    icon: Plane,
    label: "Aeronave",
    value: "Bombardier Global 7500",
  },
  render: () => (
    <div className="w-96 space-y-4">
      <InfoListItem
        icon={Plane}
        label="Aeronave"
        value="Bombardier Global 7500"
      />
      <InfoListItem
        icon={Calendar}
        label="Salida"
        value="Manana, 10:30 AM"
      />
      <InfoListItem
        icon={MapPin}
        label="Ruta"
        value="Nueva York (TEB) → Londres (LHR)"
      />
      <InfoListItem
        icon={Users}
        label="Pasajeros"
        value="4 adultos, 1 nino"
      />
      <InfoListItem
        icon={Clock}
        label="Duracion de vuelo"
        value="7h 15min"
      />
      <InfoListItem
        icon={CreditCard}
        label="Precio total"
        value="USD 65,000"
        iconColor="text-primary"
      />
    </div>
  ),
};

export const CompactList: Story = {
  args: {
    icon: Plane,
    label: "Vuelo",
    value: "MB-2024-001",
  },
  render: () => (
    <div className="w-80 border border-neutral/20 rounded-lg p-4 space-y-3">
      <h4 className="mb-4">Resumen de reserva</h4>
      <InfoListItem icon={Plane} label="Vuelo" value="MB-2024-001" />
      <InfoListItem icon={Calendar} label="Fecha" value="15 mar 2024" />
      <InfoListItem icon={Users} label="Pasajeros" value="3" />
      <InfoListItem icon={MapPin} label="Desde" value="JFK" />
      <InfoListItem icon={MapPin} label="Hasta" value="LAX" />
    </div>
  ),
};

export const StatusIndicators: Story = {
  args: {
    icon: Plane,
    label: "Estado del vuelo",
    value: "Confirmado",
  },
  render: () => (
    <div className="w-96 space-y-4">
      <InfoListItem
        icon={Plane}
        label="Estado del vuelo"
        value="Confirmado"
        iconColor="text-success"
      />
      <InfoListItem
        icon={Clock}
        label="Check-in"
        value="Abre en 2 horas"
        iconColor="text-warning"
      />
      <InfoListItem
        icon={CreditCard}
        label="Pago"
        value="Completado"
        iconColor="text-success"
      />
    </div>
  ),
};
