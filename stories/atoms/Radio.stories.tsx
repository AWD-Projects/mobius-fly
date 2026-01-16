import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "@/components/atoms/Radio";

const meta = {
  title: "Atomos/Radio",
  component: Radio,
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
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "demo",
  },
};

export const Checked: Story = {
  args: {
    name: "demo",
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    name: "demo",
    disabled: true,
  },
};

export const RadioGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Radio id="economy" name="class" value="economy" />
        <label htmlFor="economy" className="cursor-pointer">
          Economica
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Radio id="business" name="class" value="business" />
        <label htmlFor="business" className="cursor-pointer">
          Ejecutiva
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Radio id="first" name="class" value="first" />
        <label htmlFor="first" className="cursor-pointer">
          Primera clase
        </label>
      </div>
    </div>
  ),
};
