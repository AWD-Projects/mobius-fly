import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Pencil, Eye, Trash2, MoreHorizontal, Copy, Share2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableAction,
} from "@/components/molecules/Table";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { ActionLink } from "@/components/atoms/ActionLink";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/atoms/DropdownMenu";

const meta = {
  title: "Moleculas/Table",
  component: Table,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FlightsTable: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Table>
      <TableHeader>
        <TableHead width={220}>Destino</TableHead>
        <TableHead width={140}>Fecha</TableHead>
        <TableHead width={140}>Aeronave</TableHead>
        <TableHead width={100}>Tipo</TableHead>
        <TableHead width={120}>Estado</TableHead>
        <TableHead style={{ flex: 1 }}>Capacidad</TableHead>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell width={220} variant="emphasis">Madrid → Ibiza</TableCell>
          <TableCell width={140}>14 Feb · 10:30</TableCell>
          <TableCell width={140}>Citation CJ3+</TableCell>
          <TableCell width={100}><TypeBadge>Sencillo</TypeBadge></TableCell>
          <TableCell width={120}><StatusBadge status="pending">Programado</StatusBadge></TableCell>
          <TableCell style={{ flex: 1 }} variant="emphasis">4/8</TableCell>
        </TableRow>
        <TableRow>
          <TableCell width={220} variant="emphasis">Barcelona → París</TableCell>
          <TableCell width={140}>14 Feb · 14:00</TableCell>
          <TableCell width={140}>Phenom 300</TableCell>
          <TableCell width={100}><TypeBadge>Redondo</TypeBadge></TableCell>
          <TableCell width={120}><StatusBadge status="scheduled">En vuelo</StatusBadge></TableCell>
          <TableCell style={{ flex: 1 }} variant="emphasis">6/8</TableCell>
        </TableRow>
        <TableRow>
          <TableCell width={220} variant="emphasis">Málaga → Londres</TableCell>
          <TableCell width={140}>15 Feb · 08:00</TableCell>
          <TableCell width={140}>Legacy 500</TableCell>
          <TableCell width={100}><TypeBadge>Sencillo</TypeBadge></TableCell>
          <TableCell width={120}><StatusBadge status="pending">Programado</StatusBadge></TableCell>
          <TableCell style={{ flex: 1 }} variant="emphasis">8/12</TableCell>
        </TableRow>
        <TableRow isLast>
          <TableCell width={220} variant="emphasis">Valencia → Milán</TableCell>
          <TableCell width={140}>15 Feb · 11:30</TableCell>
          <TableCell width={140}>Citation CJ3+</TableCell>
          <TableCell width={100}><TypeBadge>Redondo</TypeBadge></TableCell>
          <TableCell width={120}><StatusBadge status="active">Confirmado</StatusBadge></TableCell>
          <TableCell style={{ flex: 1 }} variant="emphasis">5/8</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const AircraftTableWithTextActions: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Table>
      <TableHeader>
        <TableHead style={{ flex: 1 }}>Aeronave</TableHead>
        <TableHead style={{ flex: 1 }}>Base</TableHead>
        <TableHead width={80}>Capacidad</TableHead>
        <TableHead width={100}>Tipo</TableHead>
        <TableHead width={130}>Estado</TableHead>
        <TableHead width={80}>Matrícula</TableHead>
        <TableHead width={120}>Acción</TableHead>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell style={{ flex: 1 }} variant="emphasis">Gulfstream G650</TableCell>
          <TableCell style={{ flex: 1 }}>Madrid (MAD)</TableCell>
          <TableCell width={80}>8</TableCell>
          <TableCell width={100}><TypeBadge>Reactivo</TypeBadge></TableCell>
          <TableCell width={130}><StatusBadge status="active">Disponible</StatusBadge></TableCell>
          <TableCell width={80} variant="emphasis">EC-AAA</TableCell>
          <TableAction width={120}>
            <ActionLink icon={Pencil}>Ver detalles</ActionLink>
          </TableAction>
        </TableRow>
        <TableRow>
          <TableCell style={{ flex: 1 }} variant="emphasis">Bombardier Global 7500</TableCell>
          <TableCell style={{ flex: 1 }}>Barcelona (BCN)</TableCell>
          <TableCell width={80}>8</TableCell>
          <TableCell width={100}><TypeBadge>Reactivo</TypeBadge></TableCell>
          <TableCell width={130}><StatusBadge status="active">Disponible</StatusBadge></TableCell>
          <TableCell width={80} variant="emphasis">EC-BBB</TableCell>
          <TableAction width={120}>
            <ActionLink icon={Pencil}>Ver detalles</ActionLink>
          </TableAction>
        </TableRow>
        <TableRow isLast>
          <TableCell style={{ flex: 1 }} variant="emphasis">Cessna Citation X+</TableCell>
          <TableCell style={{ flex: 1 }}>Valencia (VLC)</TableCell>
          <TableCell width={80}>12</TableCell>
          <TableCell width={100}><TypeBadge>Turbohélice</TypeBadge></TableCell>
          <TableCell width={130}><StatusBadge status="pending">En mantenimiento</StatusBadge></TableCell>
          <TableCell width={80} variant="emphasis">EC-CCC</TableCell>
          <TableAction width={120}>
            <ActionLink icon={Pencil}>Ver detalles</ActionLink>
          </TableAction>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const TableWithIconActions: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Table>
      <TableHeader>
        <TableHead style={{ flex: 1 }}>Nombre</TableHead>
        <TableHead style={{ flex: 1 }}>Email</TableHead>
        <TableHead width={100}>Rol</TableHead>
        <TableHead width={120}>Acciones</TableHead>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell style={{ flex: 1 }} variant="emphasis">Carlos Pérez</TableCell>
          <TableCell style={{ flex: 1 }}>carlos@email.com</TableCell>
          <TableCell width={100}>Admin</TableCell>
          <TableAction width={120}>
            <ActionLink icon={Eye} variant="icon-only" aria-label="Ver" />
            <ActionLink icon={Pencil} variant="icon-only" aria-label="Editar" />
            <ActionLink icon={Trash2} variant="icon-only" aria-label="Eliminar" />
          </TableAction>
        </TableRow>
        <TableRow>
          <TableCell style={{ flex: 1 }} variant="emphasis">María García</TableCell>
          <TableCell style={{ flex: 1 }}>maria@email.com</TableCell>
          <TableCell width={100}>Usuario</TableCell>
          <TableAction width={120}>
            <ActionLink icon={Eye} variant="icon-only" aria-label="Ver" />
            <ActionLink icon={Pencil} variant="icon-only" aria-label="Editar" />
            <ActionLink icon={Trash2} variant="icon-only" aria-label="Eliminar" />
          </TableAction>
        </TableRow>
        <TableRow isLast>
          <TableCell style={{ flex: 1 }} variant="emphasis">Juan López</TableCell>
          <TableCell style={{ flex: 1 }}>juan@email.com</TableCell>
          <TableCell width={100}>Usuario</TableCell>
          <TableAction width={120}>
            <ActionLink icon={Eye} variant="icon-only" aria-label="Ver" />
            <ActionLink icon={Pencil} variant="icon-only" aria-label="Editar" />
            <ActionLink icon={Trash2} variant="icon-only" aria-label="Eliminar" />
          </TableAction>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const DocumentsTable: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Table>
      <TableHeader>
        <TableHead width={200}>Documento</TableHead>
        <TableHead style={{ flex: 1 }}>Vencimiento</TableHead>
        <TableHead width={120}>Estado</TableHead>
        <TableHead width={100}>Acción</TableHead>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell width={200} variant="emphasis">INE / Cédula de identidad</TableCell>
          <TableCell style={{ flex: 1 }}>25 Mar 2032</TableCell>
          <TableCell width={120}><StatusBadge status="active">Cargado</StatusBadge></TableCell>
          <TableAction width={100}>
            <ActionLink>Reemplazar</ActionLink>
          </TableAction>
        </TableRow>
        <TableRow isLast>
          <TableCell width={200} variant="emphasis">Pasaporte</TableCell>
          <TableCell style={{ flex: 1 }}>18 Nov 2029</TableCell>
          <TableCell width={120}><StatusBadge status="active">Cargado</StatusBadge></TableCell>
          <TableAction width={100}>
            <ActionLink>Reemplazar</ActionLink>
          </TableAction>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const TableWithMenuAction: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Table>
      <TableHeader>
        <TableHead style={{ flex: 1 }}>Vuelo</TableHead>
        <TableHead width={140}>Fecha</TableHead>
        <TableHead width={120}>Estado</TableHead>
        <TableHead width={50}>
          <span className="sr-only">Acciones</span>
        </TableHead>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell style={{ flex: 1 }} variant="emphasis">Madrid → Barcelona</TableCell>
          <TableCell width={140}>14 Feb · 10:30</TableCell>
          <TableCell width={120}><StatusBadge status="active">Confirmado</StatusBadge></TableCell>
          <TableAction width={50}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ActionLink icon={MoreHorizontal} variant="icon-only" aria-label="Más opciones" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem icon={Eye}>Ver detalles</DropdownMenuItem>
                <DropdownMenuItem icon={Pencil}>Editar</DropdownMenuItem>
                <DropdownMenuItem icon={Copy}>Duplicar</DropdownMenuItem>
                <DropdownMenuItem icon={Share2}>Compartir</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={Trash2} variant="danger">Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableAction>
        </TableRow>
        <TableRow>
          <TableCell style={{ flex: 1 }} variant="emphasis">Barcelona → París</TableCell>
          <TableCell width={140}>14 Feb · 14:00</TableCell>
          <TableCell width={120}><StatusBadge status="scheduled">En vuelo</StatusBadge></TableCell>
          <TableAction width={50}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ActionLink icon={MoreHorizontal} variant="icon-only" aria-label="Más opciones" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem icon={Eye}>Ver detalles</DropdownMenuItem>
                <DropdownMenuItem icon={Pencil}>Editar</DropdownMenuItem>
                <DropdownMenuItem icon={Copy}>Duplicar</DropdownMenuItem>
                <DropdownMenuItem icon={Share2}>Compartir</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={Trash2} variant="danger">Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableAction>
        </TableRow>
        <TableRow isLast>
          <TableCell style={{ flex: 1 }} variant="emphasis">París → Londres</TableCell>
          <TableCell width={140}>15 Feb · 09:00</TableCell>
          <TableCell width={120}><StatusBadge status="pending">Programado</StatusBadge></TableCell>
          <TableAction width={50}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ActionLink icon={MoreHorizontal} variant="icon-only" aria-label="Más opciones" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem icon={Eye}>Ver detalles</DropdownMenuItem>
                <DropdownMenuItem icon={Pencil}>Editar</DropdownMenuItem>
                <DropdownMenuItem icon={Copy}>Duplicar</DropdownMenuItem>
                <DropdownMenuItem icon={Share2}>Compartir</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={Trash2} variant="danger">Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableAction>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
