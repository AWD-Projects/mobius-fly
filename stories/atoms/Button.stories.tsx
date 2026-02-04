import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Plane, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";

const meta = {
  title: "Atomos/Boton",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "link", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isLoading: {
      control: "boolean",
    },
    iconPosition: {
      control: "radio",
      options: ["start", "end"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Reservar vuelo",
    variant: "primary",
  },
};

export const PrimaryDisabled: Story = {
  args: {
    children: "Reservar vuelo",
    variant: "primary",
    disabled: true,
  },
};

export const Secondary: Story = {
  args: {
    children: "Ver detalles",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    children: "Cancelar",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Saber mas",
    variant: "link",
  },
};

export const Outline: Story = {
  args: {
    children: "Editar",
    variant: "outline",
  },
};

export const Small: Story = {
  args: {
    children: "Boton pequeno",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Boton grande",
    size: "lg",
  },
};

export const WithIcon: Story = {
  args: {
    children: "Reservar vuelo",
    icon: <Plane size={18} />,
  },
};

export const WithLeadingAndTrailingIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <Button variant="primary">
        <Plane size={18} />
        Primario
        <ArrowRight size={18} />
      </Button>
      <Button variant="secondary">
        <Plane size={18} />
        Secundario
        <ArrowRight size={18} />
      </Button>
      <Button variant="ghost">
        <Plane size={18} />
        Fantasma
        <ArrowRight size={18} />
      </Button>
      <Button variant="outline">
        <Plane size={18} />
        Outline
        <ArrowRight size={18} />
      </Button>
      <Button variant="link">
        <Plane size={18} />
        Enlace
        <ArrowRight size={18} />
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    children: "Procesando...",
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "No disponible",
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <Button variant="primary">Boton primario</Button>
      <Button variant="secondary">Boton secundario</Button>
      <Button variant="ghost">Boton fantasma</Button>
      <Button variant="outline">Boton outline</Button>
      <Button variant="link">Boton enlace</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Pequeno</Button>
      <Button size="md">Mediano</Button>
      <Button size="lg">Grande</Button>
    </div>
  ),
};

export const ButtonStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted">Default:</span>
        <Button variant="primary">Reservar vuelo</Button>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted">Disabled:</span>
        <Button variant="primary" disabled>Reservar vuelo</Button>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted">Loading:</span>
        <Button variant="primary" isLoading>Procesando...</Button>
      </div>
    </div>
  ),
};
