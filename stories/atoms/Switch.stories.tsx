import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "@/components/atoms/Switch";

const meta = {
  title: "Atomos/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="notifications" />
      <label htmlFor="notifications" className="text-body cursor-pointer">
        Activar notificaciones
      </label>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch id="off" />
        <label htmlFor="off">Apagado</label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="on" checked readOnly />
        <label htmlFor="on">Encendido</label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="disabled-off" disabled />
        <label htmlFor="disabled-off">Apagado deshabilitado</label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="disabled-on" checked disabled />
        <label htmlFor="disabled-on">Encendido deshabilitado</label>
      </div>
    </div>
  ),
};
