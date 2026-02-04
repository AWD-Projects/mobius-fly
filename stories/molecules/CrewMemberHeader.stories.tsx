import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { CrewMemberHeader } from "@/components/molecules/CrewMemberHeader";

const meta = {
  title: "Moleculas/CrewMemberHeader",
  component: CrewMemberHeader,
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
      ],
    },
  },
} satisfies Meta<typeof CrewMemberHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initials: "CP",
    name: "Carlos Pérez",
    role: "Capitán / Piloto",
    status: "active",
  },
};

export const CoPilot: Story = {
  args: {
    initials: "MR",
    name: "María Rodríguez",
    role: "Copiloto",
    status: "active",
    avatarColor: "#2E7D32",
    avatarBgColor: "#E8F5E9",
  },
};

export const FlightAttendant: Story = {
  args: {
    initials: "JL",
    name: "Julia López",
    role: "Auxiliar de vuelo",
    status: "scheduled",
    statusLabel: "Asignada",
    avatarColor: "#6A1B9A",
    avatarBgColor: "#F3E5F5",
  },
};

export const InTraining: Story = {
  args: {
    initials: "AR",
    name: "Andrés Ruiz",
    role: "Piloto en formación",
    status: "in-review",
    statusLabel: "En entrenamiento",
    avatarColor: "#F57F17",
    avatarBgColor: "#FFF8E1",
  },
};

export const OnBreak: Story = {
  args: {
    initials: "LM",
    name: "Laura Martínez",
    role: "Capitán / Piloto",
    status: "pending",
    statusLabel: "En descanso",
    avatarColor: "#1565C0",
    avatarBgColor: "#E3F2FD",
  },
};

export const AllStatuses: Story = {
  args: {
    initials: "CP",
    name: "Carlos Pérez",
    role: "Capitán / Piloto",
    status: "active",
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <CrewMemberHeader
        initials="CP"
        name="Carlos Pérez"
        role="Capitán / Piloto"
        status="active"
      />
      <CrewMemberHeader
        initials="MR"
        name="María Rodríguez"
        role="Copiloto"
        status="scheduled"
        statusLabel="Asignada"
        avatarColor="#2E7D32"
        avatarBgColor="#E8F5E9"
      />
      <CrewMemberHeader
        initials="JL"
        name="Julia López"
        role="Auxiliar de vuelo"
        status="pending"
        statusLabel="En descanso"
        avatarColor="#6A1B9A"
        avatarBgColor="#F3E5F5"
      />
      <CrewMemberHeader
        initials="AR"
        name="Andrés Ruiz"
        role="Piloto en formación"
        status="in-review"
        statusLabel="En entrenamiento"
        avatarColor="#F57F17"
        avatarBgColor="#FFF8E1"
      />
    </div>
  ),
};
