import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AircraftInfoCard } from '../../components/organisms/AircraftInfoCard';

const meta = {
  title: 'Organisms/AircraftInfoCard',
  component: AircraftInfoCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[700px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AircraftInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    model: 'Citation CJ3+',
    registration: 'EC-MBF',
    base: 'Madrid (MAD)',
    capacity: '8 pasajeros',
    type: 'Jet ligero',
    status: 'Activo',
    statusVariant: 'active',
  },
};

export const Active: Story = {
  args: {
    model: 'Gulfstream G650',
    registration: 'EC-AAA',
    base: 'Barcelona (BCN)',
    capacity: '12 pasajeros',
    type: 'Jet ejecutivo',
    status: 'Activo',
    statusVariant: 'active',
  },
};

export const Maintenance: Story = {
  args: {
    model: 'Bombardier Global 7500',
    registration: 'EC-XYZ',
    base: 'Madrid (MAD)',
    capacity: '14 pasajeros',
    type: 'Jet ultra largo alcance',
    status: 'Mantenimiento',
    statusVariant: 'maintenance',
  },
};

export const Inactive: Story = {
  args: {
    model: 'Cessna Citation X',
    registration: 'EC-DEF',
    base: 'Málaga (AGP)',
    capacity: '8 pasajeros',
    type: 'Jet ligero',
    status: 'Inactivo',
    statusVariant: 'inactive',
  },
};
