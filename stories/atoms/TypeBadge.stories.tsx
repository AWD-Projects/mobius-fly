import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { TypeBadge } from "@/components/atoms/TypeBadge";

const meta = {
  title: "Atomos/TypeBadge",
  component: TypeBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "neutral"],
    },
  },
} satisfies Meta<typeof TypeBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Sencillo",
  },
};

export const Redondo: Story = {
  args: {
    children: "Redondo",
  },
};

export const Reactivo: Story = {
  args: {
    children: "Reactivo",
  },
};

export const Turbohelice: Story = {
  args: {
    children: "Turbohélice",
  },
};

export const Comercial: Story = {
  args: {
    children: "Comercial",
  },
};

export const Neutral: Story = {
  args: {
    children: "Otro tipo",
    variant: "neutral",
  },
};

export const FlightTypes: Story = {
  args: {
    children: "Sencillo",
  },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <TypeBadge>Sencillo</TypeBadge>
      <TypeBadge>Redondo</TypeBadge>
      <TypeBadge>Multidestino</TypeBadge>
    </div>
  ),
};

export const AircraftTypes: Story = {
  args: {
    children: "Reactivo",
  },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <TypeBadge>Reactivo</TypeBadge>
      <TypeBadge>Turbohélice</TypeBadge>
      <TypeBadge>Comercial</TypeBadge>
      <TypeBadge>Helicóptero</TypeBadge>
    </div>
  ),
};
