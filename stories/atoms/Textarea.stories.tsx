import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@/components/atoms/Textarea";

const meta = {
  title: "Atomos/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    error: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Ingresa tu mensaje",
  },
};

export const WithValue: Story = {
  args: {
    value: "Este es un mensaje de ejemplo que muestra como se ve el textarea con contenido.",
    readOnly: true,
  },
};

export const Error: Story = {
  args: {
    placeholder: "Entrada invalida",
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Textarea deshabilitado",
    disabled: true,
  },
};

export const CustomHeight: Story = {
  args: {
    placeholder: "Textarea mas alto",
    rows: 8,
  },
};
