import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PersonalDataCard } from '../../components/organisms/PersonalDataCard';

const meta = {
  title: 'Organisms/PersonalDataCard',
  component: PersonalDataCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-[550px]"><Story /></div>],
} satisfies Meta<typeof PersonalDataCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Datos personales',
    data: [
      { label: 'Nombre completo', value: 'Juan Carlos Rodríguez' },
      { label: 'Correo electrónico', value: 'juan.rodriguez@premium.aero' },
      { label: 'Rol', value: 'Propietario / Admin' },
      { label: 'Fecha de registro', value: '12 Febrero 2023' },
    ],
  },
};
