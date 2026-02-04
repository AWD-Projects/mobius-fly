import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import {
  SkeletonCard,
  SkeletonStatsCard,
  SkeletonProfileCard,
} from "@/components/molecules/SkeletonCard";

const meta = {
  title: "Moleculas/Skeleton/SkeletonCard",
  component: SkeletonCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "horizontal", "compact"],
    },
    imageAspectRatio: {
      control: "select",
      options: ["square", "video", "wide"],
    },
  },
} satisfies Meta<typeof SkeletonCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "w-[320px]",
  },
};

export const WithAvatar: Story = {
  args: {
    showAvatar: true,
    className: "w-[320px]",
  },
};

export const WithBadges: Story = {
  args: {
    showBadge: true,
    className: "w-[320px]",
  },
};

export const WithActions: Story = {
  args: {
    showActions: true,
    className: "w-[320px]",
  },
};

export const FullFeatured: Story = {
  args: {
    showAvatar: true,
    showBadge: true,
    showActions: true,
    className: "w-[320px]",
  },
};

export const NoImage: Story = {
  args: {
    showImage: false,
    showBadge: true,
    className: "w-[320px]",
  },
};

export const Horizontal: Story = {
  args: {
    variant: "horizontal",
    showBadge: true,
    className: "w-[400px]",
  },
};

export const HorizontalWithActions: Story = {
  args: {
    variant: "horizontal",
    showActions: true,
    className: "w-[400px]",
  },
};

export const Compact: Story = {
  args: {
    variant: "compact",
    showAvatar: true,
    showBadge: true,
    className: "w-[320px]",
  },
};

export const StatsCard: Story = {
  args: {
    className: "w-[280px]",
  },
  render: () => <SkeletonStatsCard className="w-[280px]" />,
};

export const StatsCardWithoutIcon: Story = {
  args: {
    className: "w-[280px]",
  },
  render: () => <SkeletonStatsCard showIcon={false} className="w-[280px]" />,
};

export const StatsCardWithoutTrend: Story = {
  args: {
    className: "w-[280px]",
  },
  render: () => <SkeletonStatsCard showTrend={false} className="w-[280px]" />,
};

export const StatsGrid: Story = {
  args: {
    className: "w-full",
  },
  render: () => (
    <div className="grid grid-cols-4 gap-4 w-[900px]">
      <SkeletonStatsCard />
      <SkeletonStatsCard />
      <SkeletonStatsCard />
      <SkeletonStatsCard />
    </div>
  ),
};

export const ProfileCard: Story = {
  args: {
    className: "w-[300px]",
  },
  render: () => <SkeletonProfileCard className="w-[300px]" />,
};

export const ProfileCardNoCover: Story = {
  args: {
    className: "w-[300px]",
  },
  render: () => <SkeletonProfileCard showCover={false} className="w-[300px]" />,
};

export const ProfileCardNoStats: Story = {
  args: {
    className: "w-[300px]",
  },
  render: () => <SkeletonProfileCard showStats={false} className="w-[300px]" />,
};

export const CardGrid: Story = {
  args: {
    className: "w-[320px]",
  },
  render: () => (
    <div className="grid grid-cols-3 gap-6 w-[1000px]">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  ),
};
