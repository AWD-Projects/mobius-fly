import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AircraftCardWithImage } from '../../components/organisms/AircraftCardWithImage';

const meta = {
  title: 'Organisms/AircraftCardWithImage',
  component: AircraftCardWithImage,
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
} satisfies Meta<typeof AircraftCardWithImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    model: 'Gulfstream G650',
    registration: 'EC-ABD',
    capacity: '13 pasajeros',
    range: '8.000 km',
    badgeText: 'Jet ejecutivo',
    badgeVariant: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=480&fit=crop',
  },
};

export const WithoutImage: Story = {
  args: {
    model: 'Citation CJ3+',
    registration: 'EC-MBF',
    capacity: '8 pasajeros',
    range: '3.500 km',
    badgeText: 'Jet ligero',
    badgeVariant: 'primary',
  },
};

export const SecondaryBadge: Story = {
  args: {
    model: 'Bombardier Global 7500',
    registration: 'EC-XYZ',
    capacity: '14 pasajeros',
    range: '14.260 km',
    badgeText: 'Ultra largo alcance',
    badgeVariant: 'secondary',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=480&fit=crop',
  },
};
