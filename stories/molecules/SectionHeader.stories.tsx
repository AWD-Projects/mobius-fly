import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeader } from "@/components/molecules/SectionHeader";

const meta = {
  title: "Moleculas/SectionHeader",
  component: SectionHeader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "radio",
      options: ["left", "center"],
    },
    size: {
      control: "radio",
      options: ["section", "page"],
    },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SectionTitle: Story = {
  args: {
    title: "Resumen de flota",
    subtitle: "Aeronaves modernas con confort refinado y avionica avanzada.",
    size: "section",
  },
};

export const PageTitle: Story = {
  args: {
    title: "Configuracion de cuenta",
    subtitle: "Gestiona preferencias, facturacion y perfil en un solo lugar.",
    size: "page",
  },
};

export const Centered: Story = {
  args: {
    title: "Tu viaje, elevado",
    subtitle: "Cada detalle pensado para una experiencia fluida y premium.",
    size: "page",
    align: "center",
  },
};
