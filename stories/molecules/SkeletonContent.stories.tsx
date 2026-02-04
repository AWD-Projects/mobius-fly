import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import {
  SkeletonPageHeader,
  SkeletonSectionHeader,
  SkeletonArticle,
  SkeletonForm,
  SkeletonDashboard,
  SkeletonDetailPage,
} from "@/components/molecules/SkeletonContent";

const meta = {
  title: "Moleculas/Skeleton/SkeletonContent",
  component: SkeletonPageHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SkeletonPageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageHeader: Story = {
  args: {},
  render: () => <SkeletonPageHeader />,
};

export const PageHeaderNoBreadcrumb: Story = {
  args: {},
  render: () => <SkeletonPageHeader showBreadcrumb={false} />,
};

export const PageHeaderNoActions: Story = {
  args: {},
  render: () => <SkeletonPageHeader showActions={false} />,
};

export const PageHeaderMinimal: Story = {
  args: {},
  render: () => (
    <SkeletonPageHeader
      showBreadcrumb={false}
      showActions={false}
      showDescription={false}
    />
  ),
};

export const SectionHeader: Story = {
  args: {},
  render: () => (
    <div className="w-[600px]">
      <SkeletonSectionHeader />
    </div>
  ),
};

export const SectionHeaderWithAction: Story = {
  args: {},
  render: () => (
    <div className="w-[600px]">
      <SkeletonSectionHeader showAction />
    </div>
  ),
};

export const Article: Story = {
  args: {},
  render: () => <SkeletonArticle />,
};

export const ArticleNoImage: Story = {
  args: {},
  render: () => <SkeletonArticle showImage={false} />,
};

export const ArticleNoAuthor: Story = {
  args: {},
  render: () => <SkeletonArticle showAuthor={false} />,
};

export const ArticleShort: Story = {
  args: {},
  render: () => <SkeletonArticle paragraphs={1} />,
};

export const Form: Story = {
  args: {},
  render: () => (
    <div className="w-[400px]">
      <SkeletonForm fields={4} />
    </div>
  ),
};

export const FormNoLabels: Story = {
  args: {},
  render: () => (
    <div className="w-[400px]">
      <SkeletonForm fields={4} showLabels={false} />
    </div>
  ),
};

export const FormTwoColumns: Story = {
  args: {},
  render: () => (
    <div className="w-[600px]">
      <SkeletonForm fields={6} columns={2} />
    </div>
  ),
};

export const FormLong: Story = {
  args: {},
  render: () => (
    <div className="w-[400px]">
      <SkeletonForm fields={8} />
    </div>
  ),
};

export const Dashboard: Story = {
  args: {},
  render: () => <SkeletonDashboard />,
};

export const DashboardNoChart: Story = {
  args: {},
  render: () => <SkeletonDashboard showChart={false} />,
};

export const DashboardNoTable: Story = {
  args: {},
  render: () => <SkeletonDashboard showTable={false} />,
};

export const DashboardStatsOnly: Story = {
  args: {},
  render: () => <SkeletonDashboard showChart={false} showTable={false} />,
};

export const DetailPage: Story = {
  args: {},
  render: () => <SkeletonDetailPage />,
};

export const DetailPageWithSidebar: Story = {
  args: {},
  render: () => <SkeletonDetailPage variant="sidebar" />,
};

export const FullPageExample: Story = {
  args: {},
  render: () => (
    <div className="space-y-6">
      <SkeletonPageHeader />
      <SkeletonDashboard statsCount={4} />
    </div>
  ),
};
