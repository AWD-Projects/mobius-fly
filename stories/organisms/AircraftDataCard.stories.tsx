import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AircraftDataCard } from '../../components/organisms/AircraftDataCard';

const meta = {
  title: 'Organisms/AircraftDataCard',
  component: AircraftDataCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AircraftDataCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Datos de la aeronave',
    data: [
      { label: 'Modelo', value: 'Gulfstream G650' },
      { label: 'Matrícula', value: 'EC-AAA' },
      { label: 'Tipo de aeronave', value: 'Jet ligero-mediano' },
      { label: 'Capacidad total', value: '8 pasajeros' },
      { label: 'Base', value: 'Madrid (MAD)' },
      { label: 'Año de fabricación', value: '2015' },
    ],
  },
};

export const ShortList: Story = {
  args: {
    data: [
      { label: 'Modelo', value: 'Citation CJ3+' },
      { label: 'Matrícula', value: 'EC-MBF' },
      { label: 'Base', value: 'Barcelona (BCN)' },
    ],
  },
};

export const ExtendedData: Story = {
  args: {
    title: 'Especificaciones técnicas',
    data: [
      { label: 'Modelo', value: 'Bombardier Global 7500' },
      { label: 'Matrícula', value: 'EC-XYZ' },
      { label: 'Tipo', value: 'Jet ultra largo alcance' },
      { label: 'Capacidad', value: '14 pasajeros' },
      { label: 'Base', value: 'Madrid (MAD)' },
      { label: 'Año', value: '2020' },
      { label: 'Alcance máximo', value: '7,700 nm' },
      { label: 'Velocidad de crucero', value: '516 kts' },
    ],
  },
};
