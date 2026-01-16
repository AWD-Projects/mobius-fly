import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@/components/atoms/Checkbox";

const meta = {
  title: "Atomos/Checkbox",
  component: Checkbox,
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
} satisfies Meta<typeof Checkbox>;

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

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <label htmlFor="terms" className="text-body cursor-pointer">
        Acepto los terminos y condiciones
      </label>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="unchecked" />
        <label htmlFor="unchecked">Sin seleccionar</label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checked" checked readOnly />
        <label htmlFor="checked">Seleccionado</label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled" disabled />
        <label htmlFor="disabled">Deshabilitado</label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checked-disabled" checked disabled />
        <label htmlFor="checked-disabled">Seleccionado y deshabilitado</label>
      </div>
    </div>
  ),
};
