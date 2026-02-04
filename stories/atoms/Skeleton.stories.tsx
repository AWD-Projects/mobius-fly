import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonBadge,
  SkeletonImage,
} from "@/components/atoms/Skeleton";

const meta = {
  title: "Atomos/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["rectangular", "circular", "text"],
    },
    animation: {
      control: "select",
      options: ["pulse", "wave", "none"],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 200,
    height: 20,
  },
};

export const Rectangular: Story = {
  args: {
    variant: "rectangular",
    width: 200,
    height: 100,
  },
};

export const Circular: Story = {
  args: {
    variant: "circular",
    width: 60,
    height: 60,
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    width: 300,
  },
};

export const TextBlock: Story = {
  args: {
    variant: "text",
  },
  render: () => (
    <div className="w-[400px]">
      <SkeletonText lines={4} lastLineWidth="60%" />
    </div>
  ),
};

export const Avatars: Story = {
  args: {
    variant: "circular",
  },
  render: () => (
    <div className="flex items-center gap-4">
      <SkeletonAvatar size="sm" />
      <SkeletonAvatar size="md" />
      <SkeletonAvatar size="lg" />
      <SkeletonAvatar size="xl" />
    </div>
  ),
};

export const Buttons: Story = {
  args: {
    variant: "rectangular",
  },
  render: () => (
    <div className="flex items-center gap-4">
      <SkeletonButton size="sm" width={80} />
      <SkeletonButton size="md" width={100} />
      <SkeletonButton size="lg" width={120} />
    </div>
  ),
};

export const Badges: Story = {
  args: {
    variant: "rectangular",
  },
  render: () => (
    <div className="flex items-center gap-4">
      <SkeletonBadge width={60} />
      <SkeletonBadge width={80} />
      <SkeletonBadge width={100} />
    </div>
  ),
};

export const Images: Story = {
  args: {
    variant: "rectangular",
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[500px]">
      <SkeletonImage aspectRatio="square" />
      <SkeletonImage aspectRatio="video" />
      <SkeletonImage aspectRatio="wide" />
      <SkeletonImage aspectRatio="portrait" />
    </div>
  ),
};

export const NoAnimation: Story = {
  args: {
    animation: "none",
    width: 200,
    height: 20,
  },
};

export const ComposedExample: Story = {
  args: {
    variant: "rectangular",
  },
  render: () => (
    <div className="flex items-start gap-4 p-4 border border-[#E5E5E5] rounded-xl w-[400px]">
      <SkeletonAvatar size="lg" />
      <div className="flex-1">
        <Skeleton height={16} width="60%" className="mb-2" />
        <SkeletonText lines={2} lastLineWidth="80%" spacing="sm" />
        <div className="flex gap-2 mt-3">
          <SkeletonBadge width={60} />
          <SkeletonBadge width={70} />
        </div>
      </div>
    </div>
  ),
};
