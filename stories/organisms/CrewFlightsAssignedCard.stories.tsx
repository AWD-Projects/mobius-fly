import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CrewFlightsAssignedCard } from '../../components/organisms/CrewFlightsAssignedCard';

const meta = {
  title: 'Organisms/CrewFlightsAssignedCard',
  component: CrewFlightsAssignedCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-[800px]"><Story /></div>],
} satisfies Meta<typeof CrewFlightsAssignedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Vuelos asignados',
    flights: [
      { route: 'MAD → BCN', date: '15 Dic, 08:30', aircraft: 'EC-ABD', status: 'Confirmado', statusVariant: 'confirmed' },
      { route: 'BCN → SVQ', date: '15 Dic, 12:15', aircraft: 'EC-ABE', status: 'Confirmado', statusVariant: 'confirmed' },
    ],
  },
};
