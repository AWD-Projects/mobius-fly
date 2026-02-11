import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CrewListCard } from '../../components/organisms/CrewListCard';

const meta = {
  title: 'Organisms/CrewListCard',
  component: CrewListCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-[400px]"><Story /></div>],
} satisfies Meta<typeof CrewListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Carlos Pérez',
    role: 'Capitán / Piloto',
    base: 'Madrid (MAD)',
    license: 'ATPL, IR, ME',
    status: 'Activo',
    statusVariant: 'active',
    avatarInitials: 'CP',
    avatarBgColor: '#E3F2FD',
    onView: () => alert('View clicked!'),
    onEdit: () => alert('Edit clicked!'),
  },
};
