import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AttentionSectionCard } from '../../components/organisms/AttentionSectionCard';
import { FileText, Clock3, Users } from 'lucide-react';

const meta = {
  title: 'Organisms/AttentionSectionCard',
  component: AttentionSectionCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AttentionSectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Requiere atención',
    items: [
      {
        icon: FileText,
        title: 'Documentación incompleta',
        subtitle: '2 vuelos pendientes',
        iconColor: '#F57F17',
      },
      {
        icon: Clock3,
        title: 'Vuelos en revisión',
        subtitle: '2 pendientes de aprobación',
        iconColor: '#F57F17',
      },
      {
        icon: Users,
        title: 'Aeronaves sin tripulación',
        subtitle: '1 aeronave sin asignar',
        iconColor: '#999999',
      },
    ],
    onItemClick: (index) => alert(`Item ${index + 1} clicked!`),
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        icon: FileText,
        title: 'Documentación incompleta',
        subtitle: '2 vuelos pendientes',
        iconColor: '#F57F17',
      },
    ],
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      {
        icon: FileText,
        title: 'Documentación incompleta',
        subtitle: '2 vuelos pendientes',
        iconColor: '#F57F17',
      },
      {
        icon: Clock3,
        title: 'Vuelos en revisión',
        subtitle: '2 pendientes de aprobación',
        iconColor: '#F57F17',
      },
      {
        icon: Users,
        title: 'Aeronaves sin tripulación',
        subtitle: '1 aeronave sin asignar',
        iconColor: '#999999',
      },
      {
        icon: FileText,
        title: 'Certificados por vencer',
        subtitle: '3 certificados expiran pronto',
        iconColor: '#F57F17',
      },
    ],
  },
};
