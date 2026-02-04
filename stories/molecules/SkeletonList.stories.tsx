import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import {
  SkeletonListItem,
  SkeletonList,
  SkeletonNavList,
  SkeletonInfoList,
} from "@/components/molecules/SkeletonList";

const meta = {
  title: "Moleculas/Skeleton/SkeletonList",
  component: SkeletonList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "compact", "detailed"],
    },
    avatarSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    lines: {
      control: "select",
      options: [1, 2, 3],
    },
  },
} satisfies Meta<typeof SkeletonList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: 5,
    className: "w-[400px]",
  },
};

export const SingleItem: Story = {
  args: {
    items: 1,
  },
  render: () => (
    <div className="w-[400px]">
      <SkeletonListItem />
    </div>
  ),
};

export const WithBadge: Story = {
  args: {
    items: 5,
    showBadge: true,
    className: "w-[400px]",
  },
};

export const WithActions: Story = {
  args: {
    items: 5,
    showActions: true,
    className: "w-[400px]",
  },
};

export const WithBadgeAndActions: Story = {
  args: {
    items: 5,
    showBadge: true,
    showActions: true,
    className: "w-[450px]",
  },
};

export const NoAvatar: Story = {
  args: {
    items: 5,
    showAvatar: false,
    className: "w-[400px]",
  },
};

export const CompactVariant: Story = {
  args: {
    items: 5,
    variant: "compact",
    className: "w-[400px]",
  },
};

export const DetailedVariant: Story = {
  args: {
    items: 5,
    variant: "detailed",
    className: "w-[400px]",
  },
};

export const OneLine: Story = {
  args: {
    items: 5,
    lines: 1,
    className: "w-[400px]",
  },
};

export const ThreeLines: Story = {
  args: {
    items: 5,
    lines: 3,
    className: "w-[400px]",
  },
};

export const NavigationList: Story = {
  args: {
    items: 6,
  },
  render: () => (
    <div className="w-[240px] p-4 border border-[#E5E5E5] rounded-xl">
      <SkeletonNavList items={6} />
    </div>
  ),
};

export const NavigationListNoIcons: Story = {
  args: {
    items: 6,
  },
  render: () => (
    <div className="w-[200px] p-4 border border-[#E5E5E5] rounded-xl">
      <SkeletonNavList items={6} showIcons={false} />
    </div>
  ),
};

export const InfoList: Story = {
  args: {
    items: 5,
  },
  render: () => (
    <div className="w-[400px] p-6 border border-[#E5E5E5] rounded-xl">
      <SkeletonInfoList items={5} />
    </div>
  ),
};

export const InfoListWideLabels: Story = {
  args: {
    items: 5,
  },
  render: () => (
    <div className="w-[450px] p-6 border border-[#E5E5E5] rounded-xl">
      <SkeletonInfoList items={5} labelWidth={140} />
    </div>
  ),
};

export const MixedContent: Story = {
  args: {
    items: 5,
  },
  render: () => (
    <div className="w-[500px] border border-[#E5E5E5] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[#E5E5E5] bg-[#FAFAFA]">
        <div className="h-5 w-32 bg-[#E5E5E5] rounded animate-pulse" />
      </div>
      <div className="p-4">
        <SkeletonList items={4} showBadge />
      </div>
    </div>
  ),
};
