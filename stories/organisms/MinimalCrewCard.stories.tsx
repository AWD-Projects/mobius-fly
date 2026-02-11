import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MinimalCrewCard } from '../../components/organisms/MinimalCrewCard';

const meta = {
  title: 'Organisms/MinimalCrewCard',
  component: MinimalCrewCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-[600px]"><Story /></div>],
} satisfies Meta<typeof MinimalCrewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    crew: [
      { name: 'Carlos Martínez', role: 'Piloto al mando', license: 'ATPL-A 2847291', initials: 'CM', avatarBgColor: '#0A0A0A' },
      { name: 'Laura García', role: 'Copiloto', license: 'CPL-A 1938472', initials: 'LG', avatarBgColor: '#666666' },
      { name: 'Juan Pérez', role: 'Tripulante', license: 'TPL-A 3456754', initials: 'JP', avatarBgColor: '#666666' },
    ],
  },
};
