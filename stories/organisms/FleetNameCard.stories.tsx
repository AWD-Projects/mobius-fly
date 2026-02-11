import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FleetNameCard } from '../../components/organisms/FleetNameCard';

const meta = {
  title: 'Organisms/FleetNameCard',
  component: FleetNameCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-[500px]"><Story /></div>],
} satisfies Meta<typeof FleetNameCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Nombre de la flota',
    label: 'Nombre identificador de tu flota',
    initialValue: 'Rodríguez Aviation Group',
    buttonText: 'Guardar cambios',
    onSave: (name) => alert(`Fleet name saved: ${name}`),
  },
};

export const Empty: Story = {
  args: {
    initialValue: '',
  },
};
