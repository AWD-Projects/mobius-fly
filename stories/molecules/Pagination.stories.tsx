import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pagination } from "@/components/molecules/Pagination";

const meta = {
  title: "Moleculas/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function PaginationDefault() {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      currentPage={page}
      totalPages={10}
      onPageChange={setPage}
    />
  );
}

function PaginationFewPages() {
  const [page, setPage] = useState(2);
  return (
    <Pagination
      currentPage={page}
      totalPages={5}
      onPageChange={setPage}
    />
  );
}

function PaginationManyPages() {
  const [page, setPage] = useState(5);
  return (
    <Pagination
      currentPage={page}
      totalPages={20}
      onPageChange={setPage}
    />
  );
}

function PaginationFirstPage() {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      currentPage={page}
      totalPages={15}
      onPageChange={setPage}
    />
  );
}

function PaginationLastPage() {
  const [page, setPage] = useState(15);
  return (
    <Pagination
      currentPage={page}
      totalPages={15}
      onPageChange={setPage}
    />
  );
}

function PaginationWithContent() {
  const [page, setPage] = useState(1);
  const flightsPerPage = 5;
  const totalFlights = 47;
  const totalPages = Math.ceil(totalFlights / flightsPerPage);

  return (
    <div className="space-y-6">
      <div className="text-small text-neutral">
        Mostrando {(page - 1) * flightsPerPage + 1} - {Math.min(page * flightsPerPage, totalFlights)} de {totalFlights} vuelos
      </div>
      <div className="border border-neutral/20 rounded-lg p-6 min-h-[200px]">
        <p className="text-body text-neutral">Resultados de vuelos para la pagina {page}</p>
      </div>
      <div className="flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationDefault />,
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 5,
    onPageChange: () => {},
  },
  render: () => <PaginationFewPages />,
};

export const ManyPages: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    onPageChange: () => {},
  },
  render: () => <PaginationManyPages />,
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 15,
    onPageChange: () => {},
  },
  render: () => <PaginationFirstPage />,
};

export const LastPage: Story = {
  args: {
    currentPage: 15,
    totalPages: 15,
    onPageChange: () => {},
  },
  render: () => <PaginationLastPage />,
};

export const WithContent: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <PaginationWithContent />,
};
