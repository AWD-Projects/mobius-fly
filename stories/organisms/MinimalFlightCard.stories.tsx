import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MinimalFlightCard } from '../../components/organisms/MinimalFlightCard';

const meta = {
  title: 'Organisms/MinimalFlightCard',
  component: MinimalFlightCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A minimal, compact flight card showing route, departure time, capacity, and flight type.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    originCode: {
      control: 'text',
      description: 'Origin airport code',
    },
    originCity: {
      control: 'text',
      description: 'Origin city name',
    },
    destinationCode: {
      control: 'text',
      description: 'Destination airport code',
    },
    destinationCity: {
      control: 'text',
      description: 'Destination city name',
    },
    departureDateTime: {
      control: 'text',
      description: 'Departure date and time',
    },
    capacity: {
      control: 'text',
      description: 'Available seats/capacity',
    },
    flightType: {
      control: 'text',
      description: 'Flight type',
    },
    capacityColor: {
      control: 'select',
      options: ['success', 'warning', 'default'],
      description: 'Capacity text color',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MinimalFlightCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    originCode: 'MAD',
    originCity: 'Madrid',
    destinationCode: 'JFK',
    destinationCity: 'Nueva York',
    departureDateTime: '15 Feb • 10:30 AM',
    capacity: '13 asientos',
    flightType: 'Sencillo',
    capacityColor: 'success',
  },
};

export const AvailableSeats: Story = {
  args: {
    originCode: 'BCN',
    originCity: 'Barcelona',
    destinationCode: 'LHR',
    destinationCity: 'Londres',
    departureDateTime: '20 Feb • 2:45 PM',
    capacity: '8 asientos',
    flightType: 'Sencillo',
    capacityColor: 'success',
  },
};

export const LimitedSeats: Story = {
  args: {
    originCode: 'LAX',
    originCity: 'Los Ángeles',
    destinationCode: 'SFO',
    destinationCity: 'San Francisco',
    departureDateTime: '18 Mar • 9:15 AM',
    capacity: '2 asientos',
    flightType: 'Redondo',
    capacityColor: 'warning',
  },
};

export const RoundTrip: Story = {
  args: {
    originCode: 'CDG',
    originCity: 'París',
    destinationCode: 'FCO',
    destinationCity: 'Roma',
    departureDateTime: '25 Feb • 11:20 AM',
    capacity: '15 asientos',
    flightType: 'Redondo',
    capacityColor: 'success',
  },
};

export const FullyBooked: Story = {
  args: {
    originCode: 'DXB',
    originCity: 'Dubai',
    destinationCode: 'BOM',
    destinationCity: 'Mumbai',
    departureDateTime: '5 Mar • 1:30 AM',
    capacity: 'Agotado',
    flightType: 'Sencillo',
    capacityColor: 'default',
  },
};

export const ShortRoute: Story = {
  args: {
    originCode: 'MAD',
    originCity: 'Madrid',
    destinationCode: 'BCN',
    destinationCity: 'Barcelona',
    departureDateTime: '10 Feb • 7:00 AM',
    capacity: '20 asientos',
    flightType: 'Sencillo',
    capacityColor: 'success',
  },
};

export const LongRoute: Story = {
  args: {
    originCode: 'SYD',
    originCity: 'Sídney',
    destinationCode: 'LAX',
    destinationCity: 'Los Ángeles',
    departureDateTime: '1 Abr • 10:00 PM',
    capacity: '6 asientos',
    flightType: 'Redondo',
    capacityColor: 'success',
  },
};

export const Clickable: Story = {
  args: {
    originCode: 'MAD',
    originCity: 'Madrid',
    destinationCode: 'JFK',
    destinationCity: 'Nueva York',
    departureDateTime: '15 Feb • 10:30 AM',
    capacity: '13 asientos',
    flightType: 'Sencillo',
    capacityColor: 'success',
    onClick: () => alert('Flight card clicked!'),
  },
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-4 p-8 bg-[#F6F6F4] max-w-[700px]">
      <MinimalFlightCard
        originCode="MAD"
        originCity="Madrid"
        destinationCode="JFK"
        destinationCity="Nueva York"
        departureDateTime="15 Feb • 10:30 AM"
        capacity="13 asientos"
        flightType="Sencillo"
        capacityColor="success"
      />
      <MinimalFlightCard
        originCode="LAX"
        originCity="Los Ángeles"
        destinationCode="SFO"
        destinationCity="San Francisco"
        departureDateTime="18 Mar • 9:15 AM"
        capacity="2 asientos"
        flightType="Redondo"
        capacityColor="warning"
      />
      <MinimalFlightCard
        originCode="DXB"
        originCity="Dubai"
        destinationCode="BOM"
        destinationCity="Mumbai"
        departureDateTime="5 Mar • 1:30 AM"
        capacity="Agotado"
        flightType="Sencillo"
        capacityColor="default"
      />
    </div>
  ),
};
