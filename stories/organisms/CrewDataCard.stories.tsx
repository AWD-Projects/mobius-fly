import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CrewDataCard } from '../../components/organisms/CrewDataCard';

const meta = {
  title: 'Organisms/CrewDataCard',
  component: CrewDataCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-[400px]"><Story /></div>],
} satisfies Meta<typeof CrewDataCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Información del tripulante',
    data: [
      { label: 'Nombre completo', value: 'Carlos Pérez García' },
      { label: 'Rol', value: 'Capitán / Piloto' },
      { label: 'No. Licencia', value: 'WKF53453' },
    ],
  },
};
