import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { InputGroup } from "@/components/molecules/InputGroup";

const meta = {
  title: "Moleculas/InputGroup",
  component: InputGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number"],
    },
    required: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Nombre completo",
    placeholder: "Ingresa tu nombre completo",
  },
};

export const Required: Story = {
  args: {
    label: "Correo electronico",
    placeholder: "email@example.com",
    type: "email",
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Contrasena",
    type: "password",
    placeholder: "Ingresa tu contrasena",
    helperText: "Debe tener al menos 8 caracteres",
  },
};

export const WithError: Story = {
  args: {
    label: "Correo electronico",
    type: "email",
    placeholder: "email@example.com",
    error: "Ingresa un correo electronico valido",
  },
};

export const Disabled: Story = {
  args: {
    label: "ID de reserva",
    value: "MB-2024-001",
    disabled: true,
  },
};

export const FormExample: Story = {
  render: () => (
    <div className="w-96 space-y-6">
      <InputGroup
        label="Nombre completo"
        placeholder="Juan Perez"
        required
      />
      <InputGroup
        label="Correo electronico"
        type="email"
        placeholder="email@example.com"
        required
      />
      <InputGroup
        label="Telefono"
        type="tel"
        placeholder="+1 (555) 000-0000"
        helperText="Lo usaremos para contactarte"
      />
      <InputGroup
        label="Cantidad de pasajeros"
        type="number"
        placeholder="2"
      />
    </div>
  ),
};
