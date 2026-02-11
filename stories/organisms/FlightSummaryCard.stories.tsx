import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FlightSummaryCard } from '../../components/organisms/FlightSummaryCard';

const meta = {
  title: 'Organisms/FlightSummaryCard',
  component: FlightSummaryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FlightSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    originCode: 'CDMX',
    destinationCode: 'JFK',
    date: 'Miércoles 15 de mayo, 2024',
    timeRange: '10:30 AM – 4:45 PM (5h 15m)',
    flightType: 'Sencillo',
    adultsCount: 2,
    minorsCount: 1,
    priceValue: '$18,750',
    currency: 'MXN',
    totalPassengers: 3,
  },
};

export const OnlyAdults: Story = {
  args: {
    originCode: 'MAD',
    destinationCode: 'BCN',
    date: 'Lunes 10 de febrero, 2026',
    timeRange: '09:00 AM – 10:15 AM (1h 15m)',
    flightType: 'Sencillo',
    adultsCount: 2,
    minorsCount: 0,
    priceValue: '$5,500',
    currency: 'MXN',
    totalPassengers: 2,
  },
};

export const RoundTrip: Story = {
  args: {
    originCode: 'LAX',
    destinationCode: 'SFO',
    date: 'Viernes 25 de marzo, 2026',
    timeRange: '1:30 PM – 3:00 PM (1h 30m)',
    flightType: 'Redondo',
    adultsCount: 4,
    minorsCount: 2,
    priceValue: '$45,000',
    currency: 'MXN',
    totalPassengers: 6,
  },
};
