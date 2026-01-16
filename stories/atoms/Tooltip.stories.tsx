import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "@/components/atoms/Tooltip";
import { HelpCircle } from "lucide-react";

const meta = {
  title: "Atomos/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
  args: {
    content: "Tooltip arriba",
    position: "top",
    children: <span className="text-small text-secondary cursor-pointer">Tooltip arriba</span>,
  },
};

export const Bottom: Story = {
  args: {
    content: "Tooltip abajo",
    position: "bottom",
    children: <span className="text-small text-secondary cursor-pointer">Tooltip abajo</span>,
  },
};

export const Left: Story = {
  args: {
    content: "Tooltip izquierda",
    position: "left",
    children: <span className="text-small text-secondary cursor-pointer">Tooltip izquierda</span>,
  },
};

export const Right: Story = {
  args: {
    content: "Tooltip derecha",
    position: "right",
    children: <span className="text-small text-secondary cursor-pointer">Tooltip derecha</span>,
  },
};

export const IconOnly: Story = {
  args: {
    content: "Mas informacion",
    position: "top",
    children: (
      <span className="inline-flex items-center text-small text-secondary cursor-pointer">
        <HelpCircle size={16} />
      </span>
    ),
  },
};

export const IconWithText: Story = {
  args: {
    content: "Detalles del servicio",
    position: "top",
    children: (
      <span className="inline-flex items-center gap-2 text-small text-secondary cursor-pointer">
        <HelpCircle size={16} />
        Ver detalles
      </span>
    ),
  },
};

export const AllPositions: Story = {
  args: {
    content: "Tooltip",
    children: <span className="text-small text-secondary">Tooltip</span>,
  },
  render: () => (
    <div className="flex gap-20 p-20">
      <Tooltip content="Tooltip arriba" position="top">
        <span className="text-small text-secondary cursor-pointer">Arriba</span>
      </Tooltip>
      <Tooltip content="Tooltip abajo" position="bottom">
        <span className="text-small text-secondary cursor-pointer">Abajo</span>
      </Tooltip>
      <Tooltip content="Tooltip izquierda" position="left">
        <span className="text-small text-secondary cursor-pointer">Izquierda</span>
      </Tooltip>
      <Tooltip content="Tooltip derecha" position="right">
        <span className="text-small text-secondary cursor-pointer">Derecha</span>
      </Tooltip>
    </div>
  ),
};
