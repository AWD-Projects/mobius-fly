import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SelectGroup } from "@/components/molecules/SelectGroup";

const meta: Meta<typeof SelectGroup> = {
  title: "Molecules/SelectGroup",
  component: SelectGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    helperText: { control: "text" },
    error: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SelectGroup>;

export const Default: Story = {
  args: {
    label: "Tipo de aeronave",
    helperText: "Selecciona el modelo",
    children: (
      <>
        <option value="">Seleccionar...</option>
        <option value="citation-cj3">Citation CJ3+</option>
        <option value="learjet-75">Learjet 75</option>
        <option value="gulfstream-g280">Gulfstream G280</option>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export const WithError: Story = {
  args: {
    label: "Tipo de aeronave",
    error: "Este campo es requerido",
    children: (
      <>
        <option value="">Seleccionar...</option>
        <option value="citation-cj3">Citation CJ3+</option>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export const Required: Story = {
  args: {
    label: "Tipo de aeronave",
    required: true,
    children: (
      <>
        <option value="">Seleccionar...</option>
        <option value="citation-cj3">Citation CJ3+</option>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    label: "Tipo de aeronave",
    disabled: true,
    children: (
      <>
        <option value="citation-cj3">Citation CJ3+</option>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};
