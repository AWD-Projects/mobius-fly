import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UpcomingFlightCard } from '../../components/organisms/UpcomingFlightCard';

const meta = {
  title: 'Organisms/UpcomingFlightCard',
  component: UpcomingFlightCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for displaying upcoming flight information with an image background, flight details, status badge, and action button.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    route: {
      control: 'text',
      description: 'Flight route (e.g., "Madrid → Nueva York")',
    },
    date: {
      control: 'text',
      description: 'Flight date',
    },
    time: {
      control: 'text',
      description: 'Departure time',
    },
    duration: {
      control: 'text',
      description: 'Flight duration',
    },
    status: {
      control: 'text',
      description: 'Status text',
    },
    statusVariant: {
      control: 'select',
      options: ['confirmed', 'pending', 'cancelled', 'completed'],
      description: 'Status color variant',
    },
    imageUrl: {
      control: 'text',
      description: 'Background image URL',
    },
    buttonText: {
      control: 'text',
      description: 'Button text',
    },
    onDetailsClick: {
      action: 'details clicked',
      description: 'Button click handler',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UpcomingFlightCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    route: 'Madrid → Nueva York',
    date: '15 Febrero 2026',
    time: '10:30 AM',
    duration: '9h 45m',
    status: 'Confirmado',
    statusVariant: 'confirmed',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop',
    buttonText: 'Ver detalles del vuelo',
  },
};

export const Confirmed: Story = {
  args: {
    route: 'Los Angeles → Tokyo',
    date: '20 Marzo 2026',
    time: '2:15 PM',
    duration: '11h 30m',
    status: 'Confirmado',
    statusVariant: 'confirmed',
    imageUrl: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=400&fit=crop',
  },
};

export const Pending: Story = {
  args: {
    route: 'Barcelona → Londres',
    date: '18 Febrero 2026',
    time: '7:45 AM',
    duration: '2h 30m',
    status: 'Pendiente',
    statusVariant: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=400&fit=crop',
  },
};

export const Cancelled: Story = {
  args: {
    route: 'París → Berlín',
    date: '16 Febrero 2026',
    time: '11:00 AM',
    duration: '1h 45m',
    status: 'Cancelado',
    statusVariant: 'cancelled',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=400&fit=crop',
  },
};

export const Completed: Story = {
  args: {
    route: 'Miami → Cancún',
    date: '10 Febrero 2026',
    time: '9:30 AM',
    duration: '3h 15m',
    status: 'Completado',
    statusVariant: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1525624286412-4099c83c1bc8?w=800&h=400&fit=crop',
  },
};

export const WithoutImage: Story = {
  args: {
    route: 'Roma → Atenas',
    date: '25 Febrero 2026',
    time: '3:00 PM',
    duration: '2h 10m',
    status: 'Confirmado',
    statusVariant: 'confirmed',
  },
};

export const LongRoute: Story = {
  args: {
    route: 'San Francisco → Singapur',
    date: '5 Marzo 2026',
    time: '10:45 PM',
    duration: '16h 20m',
    status: 'Confirmado',
    statusVariant: 'confirmed',
    imageUrl: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=800&h=400&fit=crop',
  },
};

export const CustomButtonText: Story = {
  args: {
    route: 'Dubai → Mumbai',
    date: '12 Marzo 2026',
    time: '1:20 AM',
    duration: '3h 5m',
    status: 'Confirmado',
    statusVariant: 'confirmed',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
    buttonText: 'View Flight Details',
  },
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-6 p-8 bg-[#F6F6F4] max-w-[800px]">
      <UpcomingFlightCard
        route="Madrid → Nueva York"
        date="15 Febrero 2026"
        time="10:30 AM"
        duration="9h 45m"
        status="Confirmado"
        statusVariant="confirmed"
        imageUrl="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=400&fit=crop"
      />
      <UpcomingFlightCard
        route="Barcelona → Londres"
        date="18 Febrero 2026"
        time="7:45 AM"
        duration="2h 30m"
        status="Pendiente"
        statusVariant="pending"
        imageUrl="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=400&fit=crop"
      />
      <UpcomingFlightCard
        route="París → Berlín"
        date="16 Febrero 2026"
        time="11:00 AM"
        duration="1h 45m"
        status="Cancelado"
        statusVariant="cancelled"
        imageUrl="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=400&fit=crop"
      />
    </div>
  ),
};
