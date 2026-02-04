import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from "@/components/atoms/TimePicker";

const meta = {
  title: "Atomos/TimePicker",
  component: TimePicker,
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
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Time Picker",
    value: "10:30",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Hora de salida",
    value: "10:30",
  },
};

export const WithoutLabel: Story = {
  args: {
    value: "10:30",
  },
};

export const Disabled: Story = {
  args: {
    label: "Hora de salida",
    value: "10:30",
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    label: "Hora de salida",
    error: true,
  },
};

export const FlightTimes: Story = {
  render: () => (
    <div className="flex gap-6">
      <TimePicker label="Hora de salida" value="10:30" />
      <TimePicker label="Hora de llegada" value="14:45" />
    </div>
  ),
};
