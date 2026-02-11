import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DocumentationInfoCard } from '../../components/organisms/DocumentationInfoCard';

const meta = {
  title: 'Organisms/DocumentationInfoCard',
  component: DocumentationInfoCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-[450px]"><Story /></div>],
} satisfies Meta<typeof DocumentationInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Documentación',
    text: 'INE (mexicanos) o Pasaporte. Menores requieren adulto responsable.',
  },
};

export const ExtendedText: Story = {
  args: {
    title: 'Requisitos de viaje',
    text: 'Se requiere identificación oficial vigente con fotografía. Para vuelos internacionales es obligatorio presentar pasaporte. Los menores de edad deben viajar acompañados de un adulto responsable o presentar autorización notarial de los padres.',
  },
};
