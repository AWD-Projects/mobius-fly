import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "@/components/atoms/Avatar";

const meta = {
  title: "Atomos/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initials: "CP",
  },
};

export const Small: Story = {
  args: {
    initials: "CP",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    initials: "CP",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    initials: "CP",
    size: "lg",
  },
};

export const ExtraLarge: Story = {
  args: {
    initials: "CP",
    size: "xl",
  },
};

export const CustomColors: Story = {
  args: {
    initials: "MR",
    color: "#6A1B9A",
    bgColor: "#F3E5F5",
    size: "lg",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar initials="CP" size="sm" />
      <Avatar initials="CP" size="md" />
      <Avatar initials="CP" size="lg" />
      <Avatar initials="CP" size="xl" />
    </div>
  ),
};

export const CrewAvatars: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar initials="CP" color="#1976D2" bgColor="#E3F2FD" size="lg" />
      <Avatar initials="MR" color="#2E7D32" bgColor="#E8F5E9" size="lg" />
      <Avatar initials="JL" color="#6A1B9A" bgColor="#F3E5F5" size="lg" />
      <Avatar initials="AR" color="#F57F17" bgColor="#FFF8E1" size="lg" />
    </div>
  ),
};
