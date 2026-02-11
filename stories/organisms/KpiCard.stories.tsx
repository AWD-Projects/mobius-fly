import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { KpiCard } from '../../components/organisms/KpiCard';
import {
  Plane,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const meta = {
  title: 'Organisms/KpiCard',
  component: KpiCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A KPI (Key Performance Indicator) card component for displaying important metrics with icons, values, and optional badges. Supports data prop for API integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
      description: 'Lucide icon component to display',
    },
    value: {
      control: 'text',
      description: 'The main metric value to display',
    },
    title: {
      control: 'text',
      description: 'The title of the metric',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle or description',
    },
    badgeText: {
      control: 'text',
      description: 'Optional badge text (e.g., change indicator)',
    },
    badgeColor: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info'],
      description: 'Color theme for the badge',
    },
    backgroundColor: {
      control: 'color',
      description: 'Custom background color (hex or CSS color)',
    },
    variant: {
      control: 'select',
      options: ['dark', 'primary', 'secondary'],
      description: 'Background color variant',
    },
    onClick: {
      action: 'clicked',
      description: 'Optional click handler',
    },
  },
} satisfies Meta<typeof KpiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveFlights: Story = {
  args: {
    icon: Plane,
    value: '7',
    title: 'Vuelos activos',
    subtitle: 'Programados y en curso',
    badgeText: '+2 hoy',
    badgeColor: 'success',
    variant: 'dark',
  },
};

export const WithCustomBackgroundColor: Story = {
  args: {
    icon: Plane,
    value: '12',
    title: 'Vuelos urgentes',
    subtitle: 'Requieren atención',
    badgeText: '+3',
    badgeColor: 'warning',
    backgroundColor: '#7C3AED',
    iconBackgroundColor: '#6D28D9',
    badgeBackgroundColor: '#6D28D9',
  },
};

export const WithDataProp: Story = {
  args: {
    icon: Users,
    data: {
      value: '142',
      title: 'Pasajeros totales',
      subtitle: 'Este mes',
      badgeText: '+18%',
      badgeColor: 'success',
    },
    backgroundColor: '#39424e',
  },
};

export const Loading: Story = {
  args: {
    icon: Plane,
    isLoading: true,
    backgroundColor: '#39424e',
  },
};

export const TotalPassengers: Story = {
  args: {
    icon: Users,
    value: '142',
    title: 'Pasajeros totales',
    subtitle: 'Este mes',
    badgeText: '+18%',
    badgeColor: 'success',
    variant: 'dark',
  },
};

export const UpcomingFlights: Story = {
  args: {
    icon: Calendar,
    value: '24',
    title: 'Vuelos programados',
    subtitle: 'Próximos 7 días',
    badgeText: '+5',
    badgeColor: 'info',
    variant: 'dark',
  },
};

export const Revenue: Story = {
  args: {
    icon: DollarSign,
    value: '$285K',
    title: 'Ingresos totales',
    subtitle: 'Último mes',
    badgeText: '+12.5%',
    badgeColor: 'success',
    variant: 'dark',
  },
};

export const FlightHours: Story = {
  args: {
    icon: Clock,
    value: '1,247',
    title: 'Horas de vuelo',
    subtitle: 'Este año',
    badgeText: '+156 hrs',
    badgeColor: 'success',
    variant: 'dark',
  },
};

export const CompletedFlights: Story = {
  args: {
    icon: CheckCircle,
    value: '98%',
    title: 'Vuelos completados',
    subtitle: 'Tasa de éxito',
    badgeText: '+2%',
    badgeColor: 'success',
    variant: 'dark',
  },
};

export const PendingIssues: Story = {
  args: {
    icon: AlertCircle,
    value: '3',
    title: 'Requiere atención',
    subtitle: 'Problemas pendientes',
    badgeText: '-2 resueltos',
    badgeColor: 'warning',
    variant: 'dark',
  },
};

export const NegativeTrend: Story = {
  args: {
    icon: TrendingUp,
    value: '12',
    title: 'Cancelaciones',
    subtitle: 'Este mes',
    badgeText: '+3',
    badgeColor: 'error',
    variant: 'dark',
  },
};

export const WithoutBadge: Story = {
  args: {
    icon: Plane,
    value: '45',
    title: 'Flota total',
    subtitle: 'Aeronaves activas',
    variant: 'dark',
  },
};

export const WithoutSubtitle: Story = {
  args: {
    icon: Users,
    value: '89',
    title: 'Tripulantes',
    badgeText: '+7',
    badgeColor: 'success',
    variant: 'dark',
  },
};

export const PrimaryVariant: Story = {
  args: {
    icon: Plane,
    value: '7',
    title: 'Vuelos activos',
    subtitle: 'Programados y en curso',
    badgeText: '+2 hoy',
    badgeColor: 'success',
    variant: 'primary',
  },
};

export const SecondaryVariant: Story = {
  args: {
    icon: Users,
    value: '142',
    title: 'Pasajeros totales',
    subtitle: 'Este mes',
    badgeText: '+18%',
    badgeColor: 'success',
    variant: 'secondary',
  },
};

export const Clickable: Story = {
  args: {
    icon: Plane,
    value: '7',
    title: 'Vuelos activos',
    subtitle: 'Haz clic para ver detalles',
    badgeText: '+2 hoy',
    badgeColor: 'success',
    variant: 'dark',
    onClick: () => alert('KPI Card clicked!'),
  },
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-wrap gap-6 p-8 bg-[#F6F6F4]">
      <KpiCard
        icon={Plane}
        value="7"
        title="Vuelos activos"
        subtitle="Programados y en curso"
        badgeText="+2 hoy"
        badgeColor="success"
        variant="dark"
      />
      <KpiCard
        icon={Users}
        value="142"
        title="Pasajeros totales"
        subtitle="Este mes"
        badgeText="+18%"
        badgeColor="success"
        variant="dark"
      />
      <KpiCard
        icon={Calendar}
        value="24"
        title="Vuelos programados"
        subtitle="Próximos 7 días"
        badgeText="+5"
        badgeColor="info"
        variant="dark"
      />
      <KpiCard
        icon={DollarSign}
        value="$285K"
        title="Ingresos totales"
        subtitle="Último mes"
        badgeText="+12.5%"
        badgeColor="success"
        variant="dark"
      />
    </div>
  ),
};
