"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ currentPage, totalPages, onPageChange, className }, ref) => {
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const showEllipsis = totalPages > 7;

      if (!showEllipsis) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i);
          pages.push("...");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push("...");
          pages.push(currentPage - 1, currentPage, currentPage + 1);
          pages.push("...");
          pages.push(totalPages);
        }
      }

      return pages;
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-3", className)}
        role="navigation"
        aria-label="Paginacion"
      >
        <button
          type="button"
          className={cn(
            "h-8 w-8 rounded-md text-muted transition-colors",
            "hover:text-text",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            !canGoPrevious && "cursor-not-allowed opacity-40"
          )}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          aria-label="Pagina anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-1 text-muted">
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              className={cn(
                "h-8 min-w-[32px] rounded-md px-2 text-small transition-colors",
                "text-secondary hover:text-text",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isCurrent && "text-primary font-semibold underline underline-offset-4"
              )}
              onClick={() => onPageChange(page as number)}
              aria-label={`Ir a la pagina ${page}`}
              aria-current={isCurrent ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          className={cn(
            "h-8 w-8 rounded-md text-muted transition-colors",
            "hover:text-text",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            !canGoNext && "cursor-not-allowed opacity-40"
          )}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          aria-label="Pagina siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination };
