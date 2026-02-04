import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "@/components/molecules/Breadcrumb";

const meta = {
  title: "Moleculas/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "Vuelos", href: "/vuelos" },
      { label: "MF-2025-0214", active: true },
    ],
  },
};

export const ThreeLevels: Story = {
  args: {
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Vuelos", href: "/vuelos" },
      { label: "MF-2025-0214", active: true },
    ],
  },
};

export const FourLevels: Story = {
  args: {
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Operaciones", href: "/operaciones" },
      { label: "Vuelos", href: "/vuelos" },
      { label: "Detalles", active: true },
    ],
  },
};

export const CrewNavigation: Story = {
  args: {
    items: [
      { label: "Tripulación", href: "/tripulacion" },
      { label: "Pilotos", href: "/tripulacion/pilotos" },
      { label: "Carlos Pérez", active: true },
    ],
  },
};

export const AircraftNavigation: Story = {
  args: {
    items: [
      { label: "Flota", href: "/flota" },
      { label: "Citation CJ3+", active: true },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    items: [
      { label: "Vuelos", href: "/vuelos" },
      { label: "MF-2025-0214", active: true },
    ],
    separator: "›",
  },
};

export const AllLinks: Story = {
  args: {
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Vuelos", href: "/vuelos" },
      { label: "Programados", href: "/vuelos/programados" },
    ],
  },
};
