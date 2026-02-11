import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PricePassengerSelectorCard } from '../../components/organisms/PricePassengerSelectorCard';

const meta = {
  title: 'Organisms/PricePassengerSelectorCard',
  component: PricePassengerSelectorCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PricePassengerSelectorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pricePerSeat: '$6,250',
    currency: 'MXN',
    initialAdults: 2,
    initialMinors: 1,
    maxPassengers: 20,
    buttonText: 'Continuar',
    onContinue: (adults, minors, total) => {
      alert(`Adultos: ${adults}, Menores: ${minors}, Total: ${total}`);
    },
  },
};

export const NoMinors: Story = {
  args: {
    pricePerSeat: '$12,000',
    currency: 'MXN',
    initialAdults: 1,
    initialMinors: 0,
    maxPassengers: 20,
  },
};

export const ExpensiveFlight: Story = {
  args: {
    pricePerSeat: '$45,500',
    currency: 'MXN',
    initialAdults: 2,
    initialMinors: 0,
    maxPassengers: 8,
  },
};
