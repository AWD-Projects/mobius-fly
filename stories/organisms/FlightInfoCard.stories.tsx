import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FlightInfoCard } from '../../components/organisms/FlightInfoCard';

const meta = {
  title: 'Organisms/FlightInfoCard',
  component: FlightInfoCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A detailed flight information card showing flight type, origin, destination, FBO, and schedule details.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[700px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FlightInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    flightType: 'Sencillo',
    originCity: 'Madrid, España',
    originAirport: 'Adolfo Suárez Madrid-Barajas (MAD)',
    destinationCity: 'Ibiza, España',
    destinationAirport: 'Aeropuerto de Ibiza (IBZ)',
    fboName: 'Signature Flight Support',
    fboAddress: 'Terminal Ejecutiva, Puerta 3',
    scheduleTime: '10:30 → 11:15',
    scheduleDuration: 'Duración: 45 min',
  },
};

export const RoundTrip: Story = {
  args: {
    flightType: 'Redondo',
    originCity: 'Barcelona, España',
    originAirport: 'Aeropuerto Josep Tarradellas Barcelona-El Prat (BCN)',
    destinationCity: 'Londres, Reino Unido',
    destinationAirport: 'London Heathrow Airport (LHR)',
    fboName: 'Harrods Aviation',
    fboAddress: 'Terminal 5, VIP Lounge',
    scheduleTime: '14:20 → 16:35',
    scheduleDuration: 'Duración: 2h 15min',
  },
};

export const LongHaul: Story = {
  args: {
    flightType: 'Sencillo',
    originCity: 'Nueva York, Estados Unidos',
    originAirport: 'John F. Kennedy International Airport (JFK)',
    destinationCity: 'Tokio, Japón',
    destinationAirport: 'Narita International Airport (NRT)',
    fboName: 'Jet Aviation',
    fboAddress: 'Private Terminal, Gate 2',
    scheduleTime: '18:30 → 22:45 +1',
    scheduleDuration: 'Duración: 14h 15min',
  },
};

export const ShortFlight: Story = {
  args: {
    flightType: 'Sencillo',
    originCity: 'Málaga, España',
    originAirport: 'Aeropuerto de Málaga-Costa del Sol (AGP)',
    destinationCity: 'Sevilla, España',
    destinationAirport: 'Aeropuerto de Sevilla (SVQ)',
    fboName: 'Gestair',
    fboAddress: 'Hangar 4, Terminal General',
    scheduleTime: '09:15 → 09:55',
    scheduleDuration: 'Duración: 40 min',
  },
};

export const InternationalFlight: Story = {
  args: {
    flightType: 'Redondo',
    originCity: 'Miami, Estados Unidos',
    originAirport: 'Miami International Airport (MIA)',
    destinationCity: 'Cancún, México',
    destinationAirport: 'Aeropuerto Internacional de Cancún (CUN)',
    fboName: 'Atlantic Aviation',
    fboAddress: 'FBO Terminal, Suite 100',
    scheduleTime: '11:00 → 12:45',
    scheduleDuration: 'Duración: 1h 45min',
  },
};
