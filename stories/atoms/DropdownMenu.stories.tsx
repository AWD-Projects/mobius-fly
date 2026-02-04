import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Copy,
  Share2,
  Trash2,
  Download,
  Settings,
  LogOut,
  User,
  CreditCard,
  Bell,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/atoms/DropdownMenu";
import { Button } from "@/components/atoms/Button";
import { ActionLink } from "@/components/atoms/ActionLink";

const meta = {
  title: "Atomos/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Opciones
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem icon={Eye}>Ver detalles</DropdownMenuItem>
        <DropdownMenuItem icon={Pencil}>Editar</DropdownMenuItem>
        <DropdownMenuItem icon={Copy}>Duplicar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Trash2} variant="danger">Eliminar</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithIconTrigger: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ActionLink icon={MoreHorizontal} variant="icon-only" aria-label="Más opciones" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem icon={Eye}>Ver</DropdownMenuItem>
        <DropdownMenuItem icon={Pencil}>Editar</DropdownMenuItem>
        <DropdownMenuItem icon={Download}>Descargar</DropdownMenuItem>
        <DropdownMenuItem icon={Share2}>Compartir</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Trash2} variant="danger">Eliminar</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const UserMenu: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          Mi cuenta
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem icon={User}>Perfil</DropdownMenuItem>
        <DropdownMenuItem icon={CreditCard}>Facturación</DropdownMenuItem>
        <DropdownMenuItem icon={Bell}>Notificaciones</DropdownMenuItem>
        <DropdownMenuItem icon={Settings}>Configuración</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={LogOut} variant="danger">Cerrar sesión</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const AlignStart: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Alineado a la izquierda
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem icon={Eye}>Opción 1</DropdownMenuItem>
        <DropdownMenuItem icon={Pencil}>Opción 2</DropdownMenuItem>
        <DropdownMenuItem icon={Copy}>Opción 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const AlignCenter: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Alineado al centro
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem icon={Eye}>Opción 1</DropdownMenuItem>
        <DropdownMenuItem icon={Pencil}>Opción 2</DropdownMenuItem>
        <DropdownMenuItem icon={Copy}>Opción 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithoutIcons: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Menú simple
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
        <DropdownMenuItem>Editar</DropdownMenuItem>
        <DropdownMenuItem>Duplicar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger">Eliminar</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
