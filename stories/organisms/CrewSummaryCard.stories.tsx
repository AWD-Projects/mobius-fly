import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CrewSummaryCard } from '../../components/organisms/CrewSummaryCard';

const meta = {
  title: 'Organisms/CrewSummaryCard',
  component: CrewSummaryCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-[350px]"><Story /></div>],
} satisfies Meta<typeof CrewSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Resumen',
    items: [
      { label: 'Rol', value: 'Capitán' },
      { label: 'Base', value: 'Madrid' },
      { label: 'Vuelos activos', value: '2' },
      { label: 'Última asignación', value: '15 feb 2026' },
    ],
  },
};
