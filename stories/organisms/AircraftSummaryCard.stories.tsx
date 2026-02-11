import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AircraftSummaryCard } from '../../components/organisms/AircraftSummaryCard';

const meta = {
  title: 'Organisms/AircraftSummaryCard',
  component: AircraftSummaryCard,
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
} satisfies Meta<typeof AircraftSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Resumen rápido',
    items: [
      { label: 'Capacidad', value: '8 pasajeros' },
      { label: 'Vuelos próximos', value: '4 vuelos' },
      { label: 'Base actual', value: 'Madrid (MAD)' },
    ],
  },
};

export const Extended: Story = {
  args: {
    title: 'Información general',
    items: [
      { label: 'Capacidad', value: '12 pasajeros' },
      { label: 'Vuelos próximos', value: '7 vuelos' },
      { label: 'Base actual', value: 'Barcelona (BCN)' },
      { label: 'Estado', value: 'Activo' },
      { label: 'Último vuelo', value: 'Hace 2 días' },
    ],
  },
};
