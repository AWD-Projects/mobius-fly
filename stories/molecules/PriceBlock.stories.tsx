import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { PriceBlock } from "@/components/molecules/PriceBlock";

const meta = {
  title: "Moleculas/PriceBlock",
  component: PriceBlock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PriceBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    amount: 12500,
    currency: "USD",
  },
};

export const PerHour: Story = {
  args: {
    amount: 3500,
    currency: "USD",
    period: "hora",
  },
};

export const WithDescription: Story = {
  args: {
    amount: 45000,
    currency: "USD",
    description: "Vuelo redondo a Los Angeles",
  },
};

export const DifferentCurrency: Story = {
  args: {
    amount: 38000,
    currency: "EUR",
    period: "vuelo",
  },
};

export const PriceComparison: Story = {
  args: {
    amount: 2800,
  },
  render: () => (
    <div className="flex gap-8">
      <div className="flex flex-col items-center p-6 border border-neutral/20 rounded-lg">
        <h4 className="mb-4">Jet ligero</h4>
        <PriceBlock
          amount={2800}
          currency="USD"
          period="hora"
          description="Hasta 6 pasajeros"
        />
      </div>
      <div className="flex flex-col items-center p-6 border-2 border-primary rounded-lg">
        <h4 className="mb-4">Jet mediano</h4>
        <PriceBlock
          amount={4200}
          currency="USD"
          period="hora"
          description="Hasta 8 pasajeros"
        />
      </div>
      <div className="flex flex-col items-center p-6 border border-neutral/20 rounded-lg">
        <h4 className="mb-4">Jet pesado</h4>
        <PriceBlock
          amount={6500}
          currency="USD"
          period="hora"
          description="Hasta 14 pasajeros"
        />
      </div>
    </div>
  ),
};

export const FlightPricing: Story = {
  args: {
    amount: 15000,
  },
  render: () => (
    <div className="space-y-4 p-6 border border-neutral/20 rounded-lg w-80">
      <div className="flex items-center justify-between">
        <span className="text-body">Vuelo base</span>
        <PriceBlock amount={15000} currency="USD" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-body">Catering</span>
        <PriceBlock amount={850} currency="USD" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-body">Transporte terrestre</span>
        <PriceBlock amount={500} currency="USD" />
      </div>
      <div className="border-t border-neutral/20 pt-4 mt-4">
        <div className="flex items-center justify-between">
          <span className="text-h4">Total</span>
          <PriceBlock amount={16350} currency="USD" />
        </div>
      </div>
    </div>
  ),
};
