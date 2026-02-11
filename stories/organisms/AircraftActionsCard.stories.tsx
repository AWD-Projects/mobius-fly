import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AircraftActionsCard } from '../../components/organisms/AircraftActionsCard';

const meta = {
  title: 'Organisms/AircraftActionsCard',
  component: AircraftActionsCard,
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
} satisfies Meta<typeof AircraftActionsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Acciones',
    primaryActionText: 'Marcar como mantenimiento',
    secondaryActionText: 'Editar aeronave',
    onPrimaryAction: () => alert('Primary action clicked!'),
    onSecondaryAction: () => alert('Secondary action clicked!'),
  },
};

export const CustomActions: Story = {
  args: {
    title: 'Gestión',
    primaryActionText: 'Activar aeronave',
    secondaryActionText: 'Ver historial',
  },
};
