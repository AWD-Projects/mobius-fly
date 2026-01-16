import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Plane, Calendar, MapPin, User, Clock } from "lucide-react";
import { Icon } from "@/components/atoms/Icon";

const meta = {
  title: "Atomos/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: Plane,
  },
};

export const Small: Story = {
  args: {
    icon: Plane,
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    icon: Plane,
    size: "md",
  },
};

export const Large: Story = {
  args: {
    icon: Plane,
    size: "lg",
  },
};

export const AllSizes: Story = {
  args: {
    icon: Plane,
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon={Plane} size="sm" />
      <Icon icon={Plane} size="md" />
      <Icon icon={Plane} size="lg" />
    </div>
  ),
};

export const IconCollection: Story = {
  args: {
    icon: Plane,
  },
  render: () => (
    <div className="flex flex-wrap gap-6">
      <Icon icon={Plane} />
      <Icon icon={Calendar} />
      <Icon icon={MapPin} />
      <Icon icon={User} />
      <Icon icon={Clock} />
    </div>
  ),
};

export const WithColor: Story = {
  args: {
    icon: Plane,
  },
  render: () => (
    <div className="flex gap-4">
      <Icon icon={Plane} className="text-primary" />
      <Icon icon={Plane} className="text-success" />
      <Icon icon={Plane} className="text-warning" />
      <Icon icon={Plane} className="text-error" />
    </div>
  ),
};
