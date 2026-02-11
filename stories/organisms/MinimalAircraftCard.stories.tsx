import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MinimalAircraftCard } from '../../components/organisms/MinimalAircraftCard';

const meta = {
  title: 'Organisms/MinimalAircraftCard',
  component: MinimalAircraftCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MinimalAircraftCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    model: 'G650',
    registration: 'EC-ABD',
    badgeText: 'Jet ejecutivo',
    badgeVariant: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=300&h=200&fit=crop',
  },
};

export const WithoutImage: Story = {
  args: {
    model: 'Citation CJ3+',
    registration: 'EC-MBF',
    badgeText: 'Jet ligero',
    badgeVariant: 'primary',
  },
};

export const SecondaryBadge: Story = {
  args: {
    model: 'Bombardier Global 7500',
    registration: 'EC-XYZ',
    badgeText: 'Ultra largo alcance',
    badgeVariant: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=200&fit=crop',
  },
};

export const SuccessBadge: Story = {
  args: {
    model: 'Gulfstream G550',
    registration: 'EC-AAB',
    badgeText: 'Disponible',
    badgeVariant: 'success',
    imageUrl: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=300&h=200&fit=crop',
  },
};
