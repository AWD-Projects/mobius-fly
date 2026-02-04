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
      options: [
        "active",
        "pending",
        "scheduled",
        "in-review",
        "approved",
        "rejected",
        "completed",
        "on-time",
        "success",
        "warning",
        "error",
        "info",
      ],
    },
    showDot: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    status: "active",
    children: "Activo",
  },
};

export const Pending: Story = {
  args: {
    status: "pending",
    children: "Pendiente",
  },
};

export const Scheduled: Story = {
  args: {
    status: "scheduled",
    children: "Programado",
  },
};

export const InReview: Story = {
  args: {
    status: "in-review",
    children: "En revisión",
  },
};

export const Approved: Story = {
  args: {
    status: "approved",
    children: "Aprobado",
  },
};

export const Rejected: Story = {
  args: {
    status: "rejected",
    children: "Rechazado",
  },
};

export const Completed: Story = {
  args: {
    status: "completed",
    children: "Finalizado",
  },
};

export const OnTime: Story = {
  args: {
    status: "on-time",
    children: "A tiempo",
  },
};

export const WithoutDot: Story = {
  args: {
    status: "active",
    children: "Activo",
    showDot: false,
  },
};

export const AllStatuses: Story = {
  args: {
    status: "active",
    children: "Activo",
  },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="active">Activo</StatusBadge>
      <StatusBadge status="pending">Pendiente</StatusBadge>
      <StatusBadge status="scheduled">Programado</StatusBadge>
      <StatusBadge status="in-review">En revisión</StatusBadge>
      <StatusBadge status="approved">Aprobado</StatusBadge>
      <StatusBadge status="rejected">Rechazado</StatusBadge>
      <StatusBadge status="completed">Finalizado</StatusBadge>
      <StatusBadge status="on-time">A tiempo</StatusBadge>
    </div>
  ),
};

export const FlightStatuses: Story = {
  args: {
    status: "active",
    children: "En vuelo",
  },
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">En vuelo:</span>
        <StatusBadge status="active">En vuelo</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Programado:</span>
        <StatusBadge status="scheduled">Programado</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Pendiente:</span>
        <StatusBadge status="pending">Esperando tripulación</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">A tiempo:</span>
        <StatusBadge status="on-time">A tiempo</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Completado:</span>
        <StatusBadge status="completed">Finalizado</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Cancelado:</span>
        <StatusBadge status="rejected">Cancelado</StatusBadge>
      </div>
    </div>
  ),
};

export const AircraftStatuses: Story = {
  args: {
    status: "active",
    children: "Operativo",
  },
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Operativo:</span>
        <StatusBadge status="active">Operativo</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Mantenimiento:</span>
        <StatusBadge status="in-review">En mantenimiento</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Aprobado:</span>
        <StatusBadge status="approved">Certificado</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Fuera de servicio:</span>
        <StatusBadge status="rejected">Fuera de servicio</StatusBadge>
      </div>
    </div>
  ),
};

export const CrewStatuses: Story = {
  args: {
    status: "active",
    children: "Disponible",
  },
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Disponible:</span>
        <StatusBadge status="active">Activo</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Asignado:</span>
        <StatusBadge status="scheduled">Asignado</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Descanso:</span>
        <StatusBadge status="pending">En descanso</StatusBadge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Entrenamiento:</span>
        <StatusBadge status="in-review">En entrenamiento</StatusBadge>
      </div>
    </div>
  ),
};
