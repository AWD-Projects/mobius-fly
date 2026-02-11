import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AirportFBOCard } from '../../components/organisms/AirportFBOCard';

const meta = {
  title: 'Organisms/AirportFBOCard',
  component: AirportFBOCard,
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
} satisfies Meta<typeof AirportFBOCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Aeropuertos y FBO',
    departure: {
      airport: 'Adolfo Suárez Madrid-Barajas (MAD)',
      address: 'Av. de la Hispanidad, s/n, 28042 Madrid, España',
      fbo: 'Iberia Express Premium FBO - Terminal 1, Puerta A-101',
    },
    arrival: {
      airport: 'John F. Kennedy (JFK)',
      address: 'Jamaica, Queens, NY 11430, USA',
      fbo: 'Delta Signature Flight Support - 140-12 Atlantic Avenue',
    },
  },
};

export const DomesticFlight: Story = {
  args: {
    departure: {
      airport: 'Aeropuerto Josep Tarradellas Barcelona-El Prat (BCN)',
      address: '08820 El Prat de Llobregat, Barcelona, España',
      fbo: 'Gestair Barcelona - Terminal General',
    },
    arrival: {
      airport: 'Aeropuerto de Málaga-Costa del Sol (AGP)',
      address: 'Av. del Comandante García Morato, s/n, 29004 Málaga, España',
      fbo: 'Málaga Executive Aviation - Terminal VIP',
    },
  },
};
