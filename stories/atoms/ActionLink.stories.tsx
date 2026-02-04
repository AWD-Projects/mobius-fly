import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Pencil, Eye, Download, Trash2, RefreshCw, MoreHorizontal } from "lucide-react";
import { ActionLink } from "@/components/atoms/ActionLink";

const meta = {
  title: "Atomos/ActionLink",
  component: ActionLink,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "icon-only"],
    },
  },
} satisfies Meta<typeof ActionLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Ver detalles",
  },
};

export const WithIcon: Story = {
  args: {
    icon: Pencil,
    children: "Ver detalles",
  },
};

export const IconOnly: Story = {
  args: {
    icon: Pencil,
    variant: "icon-only",
    "aria-label": "Editar",
  },
};

export const TextActions: Story = {
  args: {
    children: "Reemplazar",
  },
  render: () => (
    <div className="flex flex-wrap gap-6">
      <ActionLink>Ver detalles</ActionLink>
      <ActionLink>Reemplazar</ActionLink>
      <ActionLink>Descargar</ActionLink>
      <ActionLink>Editar</ActionLink>
    </div>
  ),
};

export const IconWithTextActions: Story = {
  args: {
    icon: Pencil,
    children: "Editar",
  },
  render: () => (
    <div className="flex flex-wrap gap-6">
      <ActionLink icon={Eye}>Ver</ActionLink>
      <ActionLink icon={Pencil}>Editar</ActionLink>
      <ActionLink icon={Download}>Descargar</ActionLink>
      <ActionLink icon={RefreshCw}>Reemplazar</ActionLink>
    </div>
  ),
};

export const IconOnlyActions: Story = {
  args: {
    icon: Pencil,
    variant: "icon-only",
  },
  render: () => (
    <div className="flex items-center gap-2">
      <ActionLink icon={Eye} variant="icon-only" aria-label="Ver" />
      <ActionLink icon={Pencil} variant="icon-only" aria-label="Editar" />
      <ActionLink icon={Download} variant="icon-only" aria-label="Descargar" />
      <ActionLink icon={Trash2} variant="icon-only" aria-label="Eliminar" />
      <ActionLink icon={MoreHorizontal} variant="icon-only" aria-label="Más opciones" />
    </div>
  ),
};
