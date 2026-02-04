import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "@/components/atoms/DatePicker";

const meta = {
  title: "Atomos/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    error: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Date Picker",
    value: "2025-02-14",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Fecha de vuelo",
    value: "2025-02-14",
  },
};

export const WithoutLabel: Story = {
  args: {
    value: "2025-02-14",
  },
};

export const Disabled: Story = {
  args: {
    label: "Fecha de vuelo",
    value: "2025-02-14",
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    label: "Fecha de vuelo",
    error: true,
  },
};

export const FlightDates: Story = {
  render: () => (
    <div className="flex gap-6">
      <DatePicker label="Fecha de salida" value="2025-02-14" />
      <DatePicker label="Fecha de regreso" value="2025-02-21" />
    </div>
  ),
};
