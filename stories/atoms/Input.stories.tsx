import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/atoms/Input";

const meta = {
  title: "Atomos/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "date", "time"],
    },
    error: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Ingresa tu nombre",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "email@example.com",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Ingresa tu contrasena",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "Numero de pasajeros",
  },
};

export const Date: Story = {
  args: {
    type: "date",
  },
};

export const WithValue: Story = {
  args: {
    value: "Juan Perez",
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
    placeholder: "Input deshabilitado",
    disabled: true,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input type="text" placeholder="Input de texto" />
      <Input type="email" placeholder="Input de correo" />
      <Input type="password" placeholder="Input de contrasena" />
      <Input type="number" placeholder="Input numerico" />
      <Input type="date" />
      <Input type="time" />
    </div>
  ),
};
