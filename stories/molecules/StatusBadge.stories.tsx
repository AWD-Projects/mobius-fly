import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "@/components/molecules/StatusBadge";

const meta = {
  title: "Moleculas/StatusBadge",
  component: StatusBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["success", "warning", "error", "info"],
    },
    showIcon: {
      control: "boolean",
    },
    iconPosition: {
      control: "radio",
      options: ["start", "end"],
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    status: "success",
    children: "Vuelo confirmado",
  },
};

export const Warning: Story = {
  args: {
    status: "warning",
    children: "Pendiente de aprobacion",
  },
};

export const Error: Story = {
  args: {
    status: "error",
    children: "Reserva cancelada",
  },
};

export const Info: Story = {
  args: {
    status: "info",
    children: "En progreso",
  },
};

export const WithoutIcon: Story = {
  args: {
    status: "success",
    children: "Confirmado",
    showIcon: false,
  },
};

export const AllStatuses: Story = {
  args: {
    status: "success",
    children: "Vuelo confirmado",
  },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="success">Vuelo confirmado</StatusBadge>
      <StatusBadge status="warning">Retraso por clima</StatusBadge>
      <StatusBadge status="error">Cancelado</StatusBadge>
      <StatusBadge status="info">Check-in abierto</StatusBadge>
    </div>
  ),
};

export const BookingStatuses: Story = {
  args: {
    status: "success",
    children: "Listo para volar",
  },
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-32">Confirmado:</span>
        <StatusBadge status="success">Listo para volar</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32">Pendiente:</span>
        <StatusBadge status="warning">Esperando pago</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32">Cancelado:</span>
        <StatusBadge status="error">Reserva cancelada</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32">En ruta:</span>
        <StatusBadge status="info">En camino</StatusBadge>
      </div>
    </div>
  ),
};
