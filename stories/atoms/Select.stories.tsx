import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "@/components/atoms/Select";

const meta = {
  title: "Atomos/Select",
  component: Select,
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
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <option value="">Selecciona un destino</option>
        <option value="nyc">Nueva York</option>
        <option value="lax">Los Angeles</option>
        <option value="mia">Miami</option>
        <option value="lon">Londres</option>
      </>
    ),
  },
};

export const WithValue: Story = {
  args: {
    value: "nyc",
    children: (
      <>
        <option value="">Selecciona un destino</option>
        <option value="nyc">Nueva York</option>
        <option value="lax">Los Angeles</option>
        <option value="mia">Miami</option>
      </>
    ),
  },
};

export const Error: Story = {
  args: {
    error: true,
    children: (
      <>
        <option value="">Selecciona un destino</option>
        <option value="nyc">Nueva York</option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <option value="">Selecciona un destino</option>
        <option value="nyc">Nueva York</option>
      </>
    ),
  },
};
