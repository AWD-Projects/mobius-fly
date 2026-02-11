import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AdminControlCard } from '../../components/organisms/AdminControlCard';

const meta = {
  title: 'Organisms/AdminControlCard',
  component: AdminControlCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-[500px]"><Story /></div>],
} satisfies Meta<typeof AdminControlCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    summary: {
      total: 8,
      sold: 4,
      available: 4,
      pricePerSeat: '$500.00',
      currency: 'MXN',
    },
    passengers: [
      { name: 'Juan Pérez', seat: 'A1' },
      { name: 'María García', seat: 'A2' },
      { name: 'Carlos López', seat: 'B1' },
      { name: 'Ana Martínez', seat: 'B2' },
    ],
    primaryActionText: 'Marcar como En vuelo',
    secondaryActionText: 'Editar vuelo',
    onDownloadManifest: () => alert('Download manifest!'),
    onPrimaryAction: () => alert('Primary action!'),
    onSecondaryAction: () => alert('Secondary action!'),
  },
};
