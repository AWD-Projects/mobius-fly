import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PastFlightCard } from '../../components/organisms/PastFlightCard';

const meta = {
  title: 'Organisms/PastFlightCard',
  component: PastFlightCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A horizontal card component for displaying past flight information with an image on the left and flight details on the right.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    route: {
      control: 'text',
      description: 'Flight route (e.g., "París → Barcelona")',
    },
    date: {
      control: 'text',
      description: 'Flight date',
    },
    timeRange: {
      control: 'text',
      description: 'Flight time range (e.g., "09:30 - 11:15")',
    },
    status: {
      control: 'text',
      description: 'Status text',
    },
    statusVariant: {
      control: 'select',
      options: ['completed', 'cancelled', 'delayed'],
      description: 'Status color variant',
    },
    imageUrl: {
      control: 'text',
      description: 'Flight image URL',
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
      <div className="w-[700px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PastFlightCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    route: 'París → Barcelona',
    date: '1 Feb 2026',
    timeRange: '09:30 - 11:15',
    status: 'Completado',
    statusVariant: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1566178077342-300aa756792e?w=400&h=280&fit=crop',
    buttonText: 'Ver detalles',
  },
};

export const Completed: Story = {
  args: {
    route: 'Madrid → Lisboa',
    date: '28 Enero 2026',
    timeRange: '14:20 - 15:35',
    status: 'Completado',
    statusVariant: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400&h=280&fit=crop',
  },
};

export const Cancelled: Story = {
  args: {
    route: 'Roma → Milán',
    date: '25 Enero 2026',
    timeRange: '11:00 - 12:15',
    status: 'Cancelado',
    statusVariant: 'cancelled',
    imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=280&fit=crop',
  },
};

export const Delayed: Story = {
  args: {
    route: 'Londres → Dublín',
    date: '30 Enero 2026',
    timeRange: '16:45 - 18:20',
    status: 'Retrasado',
    statusVariant: 'delayed',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=280&fit=crop',
  },
};

export const WithoutImage: Story = {
  args: {
    route: 'Berlín → Ámsterdam',
    date: '22 Enero 2026',
    timeRange: '08:15 - 09:45',
    status: 'Completado',
    statusVariant: 'completed',
  },
};

export const LongRoute: Story = {
  args: {
    route: 'Nueva York → Los Ángeles',
    date: '15 Enero 2026',
    timeRange: '06:30 - 09:45',
    status: 'Completado',
    statusVariant: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=280&fit=crop',
  },
};

export const CustomButtonText: Story = {
  args: {
    route: 'Barcelona → Madrid',
    date: '18 Enero 2026',
    timeRange: '19:00 - 20:20',
    status: 'Completado',
    statusVariant: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1525624286412-4099c83c1bc8?w=400&h=280&fit=crop',
    buttonText: 'View Details',
  },
};

export const ShortFlight: Story = {
  args: {
    route: 'Sevilla → Valencia',
    date: '12 Enero 2026',
    timeRange: '12:10 - 13:25',
    status: 'Completado',
    statusVariant: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=400&h=280&fit=crop',
  },
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-4 p-8 bg-[#F6F6F4] max-w-[800px]">
      <PastFlightCard
        route="París → Barcelona"
        date="1 Feb 2026"
        timeRange="09:30 - 11:15"
        status="Completado"
        statusVariant="completed"
        imageUrl="https://images.unsplash.com/photo-1566178077342-300aa756792e?w=400&h=280&fit=crop"
      />
      <PastFlightCard
        route="Roma → Milán"
        date="25 Enero 2026"
        timeRange="11:00 - 12:15"
        status="Cancelado"
        statusVariant="cancelled"
        imageUrl="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=280&fit=crop"
      />
      <PastFlightCard
        route="Londres → Dublín"
        date="30 Enero 2026"
        timeRange="16:45 - 18:20"
        status="Retrasado"
        statusVariant="delayed"
        imageUrl="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=280&fit=crop"
      />
      <PastFlightCard
        route="Berlín → Ámsterdam"
        date="22 Enero 2026"
        timeRange="08:15 - 09:45"
        status="Completado"
        statusVariant="completed"
      />
    </div>
  ),
};
