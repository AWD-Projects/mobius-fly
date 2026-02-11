import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AircraftDocumentationCard } from '../../components/organisms/AircraftDocumentationCard';

const meta = {
  title: 'Organisms/AircraftDocumentationCard',
  component: AircraftDocumentationCard,
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
} satisfies Meta<typeof AircraftDocumentationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Documentación',
    documents: [
      { name: 'Certificado aeronavegabilidad', status: 'Validado', statusVariant: 'validated' },
      { name: 'Póliza de seguro', status: 'En revisión', statusVariant: 'review' },
      { name: 'Registro de aeronave', status: 'Rechazado', statusVariant: 'rejected' },
    ],
  },
};

export const AllValidated: Story = {
  args: {
    documents: [
      { name: 'Certificado aeronavegabilidad', status: 'Validado', statusVariant: 'validated' },
      { name: 'Póliza de seguro', status: 'Validado', statusVariant: 'validated' },
      { name: 'Registro de aeronave', status: 'Validado', statusVariant: 'validated' },
    ],
  },
};

export const MixedStatuses: Story = {
  args: {
    documents: [
      { name: 'Certificado aeronavegabilidad', status: 'Validado', statusVariant: 'validated' },
      { name: 'Póliza de seguro', status: 'En revisión', statusVariant: 'review' },
      { name: 'Registro de aeronave', status: 'En revisión', statusVariant: 'review' },
      { name: 'Seguro de responsabilidad', status: 'Validado', statusVariant: 'validated' },
    ],
  },
};
