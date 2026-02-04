import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Plane, UserPlus, Calendar, Settings, Download } from "lucide-react";
import {
  QuickActions,
  createDefaultFlightActions,
} from "@/components/molecules/QuickActions";

const meta: Meta<typeof QuickActions> = {
  title: "Molecules/QuickActions",
  component: QuickActions,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof QuickActions>;

export const Default: Story = {
  args: {
    actions: createDefaultFlightActions({
      onNewFlight: () => alert("New flight"),
      onAddAircraft: () => alert("Add aircraft"),
      onAddCrew: () => alert("Add crew"),
    }),
  },
};

export const FlightActions: Story = {
  args: {
    actions: [
      {
        id: "new-flight",
        label: "Nuevo vuelo",
        icon: Plus,
        variant: "primary",
        onClick: () => alert("New flight"),
      },
      {
        id: "add-aircraft",
        label: "Agregar aeronave",
        icon: Plane,
        onClick: () => alert("Add aircraft"),
      },
      {
        id: "add-crew",
        label: "Agregar tripulacion",
        icon: UserPlus,
        onClick: () => alert("Add crew"),
      },
    ],
  },
};

export const CalendarActions: Story = {
  args: {
    actions: [
      {
        id: "schedule",
        label: "Programar",
        icon: Calendar,
        variant: "primary",
        onClick: () => {},
      },
      {
        id: "export",
        label: "Exportar",
        icon: Download,
        onClick: () => {},
      },
      {
        id: "settings",
        label: "Configuracion",
        icon: Settings,
        onClick: () => {},
      },
    ],
  },
};

export const SingleAction: Story = {
  args: {
    actions: [
      {
        id: "new-flight",
        label: "Nuevo vuelo",
        icon: Plus,
        variant: "primary",
        onClick: () => {},
      },
    ],
  },
};

export const AllSecondary: Story = {
  args: {
    actions: [
      {
        id: "download",
        label: "Descargar",
        icon: Download,
        onClick: () => {},
      },
      {
        id: "settings",
        label: "Configuracion",
        icon: Settings,
        onClick: () => {},
      },
    ],
  },
};
