import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FilterBar, FilterConfig } from "@/components/molecules/FilterBar";

const meta: Meta<typeof FilterBar> = {
  title: "Molecules/FilterBar",
  component: FilterBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

const FilterBarWithState = () => {
  const [filters, setFilters] = useState({
    origin: "madrid",
    destination: "paris",
    status: "all",
  });

  const filterConfigs: FilterConfig[] = [
    {
      id: "origin",
      label: "Origen",
      value: filters.origin,
      options: [
        { value: "all", label: "Todos" },
        { value: "madrid", label: "Madrid" },
        { value: "barcelona", label: "Barcelona" },
        { value: "mexico", label: "Mexico City" },
      ],
      onChange: (value) => setFilters((f) => ({ ...f, origin: value })),
    },
    {
      id: "destination",
      label: "Destino",
      value: filters.destination,
      options: [
        { value: "all", label: "Todos" },
        { value: "paris", label: "Paris" },
        { value: "london", label: "Londres" },
        { value: "new-york", label: "Nueva York" },
      ],
      onChange: (value) => setFilters((f) => ({ ...f, destination: value })),
    },
    {
      id: "status",
      label: "Estado",
      value: filters.status,
      options: [
        { value: "all", label: "Todos" },
        { value: "active", label: "Activo" },
        { value: "pending", label: "Pendiente" },
        { value: "completed", label: "Completado" },
      ],
      onChange: (value) => setFilters((f) => ({ ...f, status: value })),
    },
  ];

  const handleClear = () => {
    setFilters({
      origin: "all",
      destination: "all",
      status: "all",
    });
  };

  return (
    <FilterBar
      filters={filterConfigs}
      onClear={handleClear}
      clearLabel="Limpiar"
    />
  );
};

export const Default: Story = {
  render: () => <FilterBarWithState />,
};

export const TwoFilters: Story = {
  args: {
    filters: [
      {
        id: "origin",
        label: "Origen",
        value: "madrid",
        options: [
          { value: "madrid", label: "Madrid" },
          { value: "barcelona", label: "Barcelona" },
        ],
        onChange: () => {},
      },
      {
        id: "destination",
        label: "Destino",
        value: "paris",
        options: [
          { value: "paris", label: "Paris" },
          { value: "london", label: "Londres" },
        ],
        onChange: () => {},
      },
    ],
    onClear: () => {},
  },
};

export const WithoutClear: Story = {
  args: {
    filters: [
      {
        id: "status",
        label: "Estado",
        value: "all",
        options: [
          { value: "all", label: "Todos" },
          { value: "active", label: "Activo" },
          { value: "pending", label: "Pendiente" },
        ],
        onChange: () => {},
      },
    ],
  },
};
