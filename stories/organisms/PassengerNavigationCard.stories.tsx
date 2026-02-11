import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PassengerNavigationCard } from '../../components/organisms/PassengerNavigationCard';

const meta = {
  title: 'Organisms/PassengerNavigationCard',
  component: PassengerNavigationCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-[450px]"><Story /></div>],
} satisfies Meta<typeof PassengerNavigationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Pasajeros',
    adults: {
      title: 'Adultos (2)',
      passengers: [
        { label: 'Pasajero 1', isCompleted: true },
        { label: 'Pasajero 2', isCompleted: false },
      ],
    },
    minors: {
      title: 'Menores (1)',
      passengers: [
        { label: 'Pasajero 3', isCompleted: false },
      ],
    },
    onPassengerClick: (type, index) => alert(`${type} passenger ${index + 1} clicked!`),
  },
};
