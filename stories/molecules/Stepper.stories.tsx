import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "@/components/molecules/Stepper";

const meta = {
  title: "Moleculas/Stepper",
  component: Stepper,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const bookingSteps = [
  { label: "Seleccion de vuelo", description: "Elige tu ruta" },
  { label: "Pasajeros", description: "Agrega detalles del viajero" },
  { label: "Pago", description: "Completa la reserva" },
  { label: "Confirmacion", description: "Revisa los detalles" },
];

export const FirstStep: Story = {
  args: {
    steps: bookingSteps,
    currentStep: 0,
  },
};

export const SecondStep: Story = {
  args: {
    steps: bookingSteps,
    currentStep: 1,
  },
};

export const ThirdStep: Story = {
  args: {
    steps: bookingSteps,
    currentStep: 2,
  },
};

export const LastStep: Story = {
  args: {
    steps: bookingSteps,
    currentStep: 3,
  },
};

export const SimpleSteps: Story = {
  args: {
    steps: [
      { label: "Buscar" },
      { label: "Reservar" },
      { label: "Volar" },
    ],
    currentStep: 1,
  },
};

export const DetailedBooking: Story = {
  args: {
    steps: [
      { label: "Seleccion de vuelo", description: "Elige tu vuelo ideal" },
      { label: "Info de pasajeros", description: "Ingresa datos del viajero" },
      { label: "Seleccion de asiento", description: "Elige tus asientos" },
      { label: "Extras", description: "Mejora tu experiencia" },
      { label: "Pago", description: "Checkout seguro" },
    ],
    currentStep: 2,
  },
};
