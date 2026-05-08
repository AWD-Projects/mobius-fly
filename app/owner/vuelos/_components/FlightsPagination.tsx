"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface FlightsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const FlightsPagination: React.FC<FlightsPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pages;
  };

  return (
    <div className="w-full flex items-center justify-between px-0 py-5">
      {/* Pagination Controls */}
      <div className="flex items-center gap-3">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 rounded-md border border-border flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-muted" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-md text-caption font-semibold transition-colors ${
              currentPage === page
                ? "bg-text text-white"
                : "border border-border text-muted hover:bg-neutral/10"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 rounded-md border border-border flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral/10 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-muted" />
        </button>
      </div>

      {/* Results Info */}
      <div className="text-caption text-muted">
        Mostrando {startItem}-{endItem} de {totalItems} vuelos
      </div>
    </div>
  );
};
