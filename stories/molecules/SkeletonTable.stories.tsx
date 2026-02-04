import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { SkeletonTable, SkeletonTableRow } from "@/components/molecules/SkeletonTable";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/molecules/Table";

const meta = {
  title: "Moleculas/Skeleton/SkeletonTable",
  component: SkeletonTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SkeletonTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rows: 5,
    columns: 5,
  },
};

export const FewRows: Story = {
  args: {
    rows: 3,
    columns: 4,
  },
};

export const ManyColumns: Story = {
  args: {
    rows: 4,
    columns: 7,
  },
};

export const WithoutHeader: Story = {
  args: {
    rows: 5,
    columns: 4,
    showHeader: false,
  },
};

export const WithoutActions: Story = {
  args: {
    rows: 5,
    columns: 4,
    showActions: false,
  },
};

export const FlightsTableSkeleton: Story = {
  args: {
    rows: 4,
    columns: 6,
    columnWidths: [220, 140, 140, 100, 120],
    showActions: false,
  },
};

export const InlineLoading: Story = {
  args: {
    rows: 3,
  },
  render: () => (
    <Table>
      <TableHeader>
        <TableHead style={{ flex: 1 }}>Nombre</TableHead>
        <TableHead width={150}>Email</TableHead>
        <TableHead width={100}>Rol</TableHead>
        <TableHead width={120}>Estado</TableHead>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell style={{ flex: 1 }} variant="emphasis">Carlos Pérez</TableCell>
          <TableCell width={150}>carlos@email.com</TableCell>
          <TableCell width={100}>Admin</TableCell>
          <TableCell width={120}>Activo</TableCell>
        </TableRow>
        <SkeletonTableRow columns={4} />
        <SkeletonTableRow columns={4} />
        <SkeletonTableRow columns={4} isLast />
      </TableBody>
    </Table>
  ),
};
