import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Download, Filter } from "lucide-react";
import { TableHeaderWithAction } from "@/components/molecules/TableHeaderWithAction";

const meta: Meta<typeof TableHeaderWithAction> = {
  title: "Molecules/TableHeaderWithAction",
  component: TableHeaderWithAction,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TableHeaderWithAction>;

export const Default: Story = {
  args: {
    title: "Vuelos proximos",
    actionLabel: "Nuevo vuelo",
    actionIcon: <Plus className="h-4 w-4" />,
    onAction: () => alert("New flight clicked"),
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] bg-surface p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const SecondaryAction: Story = {
  args: {
    title: "Historial de vuelos",
    actionLabel: "Exportar",
    actionIcon: <Download className="h-4 w-4" />,
    actionVariant: "outline",
    onAction: () => alert("Export clicked"),
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] bg-surface p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const WithoutIcon: Story = {
  args: {
    title: "Pasajeros",
    actionLabel: "Ver todos",
    actionVariant: "ghost",
    onAction: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] bg-surface p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const TitleOnly: Story = {
  args: {
    title: "Detalles del vuelo",
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] bg-surface p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const WithChildren: Story = {
  args: {
    title: "Aeronaves",
    actionLabel: "Agregar",
    actionIcon: <Plus className="h-4 w-4" />,
    children: (
      <button className="flex items-center gap-2 px-3 py-1.5 text-small text-muted hover:text-text border border-border rounded-lg">
        <Filter className="h-4 w-4" />
        Filtrar
      </button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] bg-surface p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};
