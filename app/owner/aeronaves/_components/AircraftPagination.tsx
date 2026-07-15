"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface AircraftPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const AircraftPagination: React.FC<AircraftPaginationProps> = ({
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
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 2) {
      pages.push(1, 2, 3);
    } else if (currentPage >= totalPages - 1) {
      pages.push(totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(currentPage - 1, currentPage, currentPage + 1);
    }
    return pages;
  };

  const btnBase = "w-7 h-7 rounded-md flex items-center justify-center text-[12px] transition-colors";

  return (
    <div className="w-full flex items-center justify-between py-6">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} ${
              currentPage === page
                ? "bg-[#EBEBEB] text-text font-medium"
                : "text-muted hover:text-text hover:bg-[#F5F5F5]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <span className="text-[11px] text-muted">
        {startItem}–{endItem} de {totalItems} aeronaves
      </span>
    </div>
  );
};
