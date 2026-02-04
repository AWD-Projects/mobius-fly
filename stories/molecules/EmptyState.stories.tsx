import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Inbox, Plane, Users, FileText, Calendar } from "lucide-react";
import { EmptyState } from "@/components/molecules/EmptyState";
import { Button } from "@/components/atoms/Button";

const meta = {
  title: "Moleculas/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "No hay vuelos",
    description: "Crea un nuevo vuelo para comenzar",
  },
};

export const WithCustomIcon: Story = {
  args: {
    icon: Plane,
    title: "Sin vuelos programados",
    description: "No tienes vuelos programados para hoy",
  },
};

export const WithAction: Story = {
  args: {
    icon: Plane,
    title: "No hay vuelos",
    description: "Crea un nuevo vuelo para comenzar",
    action: <Button size="sm">Crear vuelo</Button>,
  },
};

export const NoUsers: Story = {
  args: {
    icon: Users,
    title: "Sin tripulación asignada",
    description: "Asigna tripulación a este vuelo",
    action: <Button size="sm">Asignar tripulación</Button>,
  },
};

export const NoDocuments: Story = {
  args: {
    icon: FileText,
    title: "Sin documentos",
    description: "Aún no has subido ningún documento",
    action: <Button size="sm">Subir documento</Button>,
  },
};

export const NoReservations: Story = {
  args: {
    icon: Calendar,
    title: "Sin reservas",
    description: "No tienes reservas pendientes",
  },
};

export const AllExamples: Story = {
  args: {
    title: "No hay vuelos",
    description: "Crea un nuevo vuelo para comenzar",
  },
  render: () => (
    <div className="flex flex-col gap-6 w-[500px]">
      <EmptyState
        icon={Inbox}
        title="No hay vuelos"
        description="Crea un nuevo vuelo para comenzar"
      />
      <EmptyState
        icon={Users}
        title="Sin tripulación"
        description="Asigna tripulación a este vuelo"
        action={<Button size="sm">Asignar</Button>}
      />
    </div>
  ),
};
