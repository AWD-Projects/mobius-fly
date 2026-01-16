import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { ButtonGroup } from "@/components/molecules/ButtonGroup";
import { Button } from "@/components/atoms/Button";

const meta = {
  title: "Moleculas/ButtonGroup",
  component: ButtonGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    children: (
      <>
        <Button variant="primary">Confirmar</Button>
        <Button variant="ghost">Cancelar</Button>
      </>
    ),
  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    children: (
      <>
        <Button variant="primary">Reservar ahora</Button>
        <Button variant="secondary">Solicitar cotizacion</Button>
        <Button variant="ghost">Saber mas</Button>
      </>
    ),
  },
};

export const ActionButtons: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Guardar cambios</Button>
      <Button variant="secondary">Vista previa</Button>
      <Button variant="ghost">Cancelar</Button>
    </ButtonGroup>
  ),
};

export const NavigationButtons: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <ButtonGroup>
      <Button variant="ghost">Anterior</Button>
      <Button variant="primary">Siguiente paso</Button>
    </ButtonGroup>
  ),
};
