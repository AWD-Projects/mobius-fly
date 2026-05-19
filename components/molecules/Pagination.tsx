"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";

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
        <IconButton
          variant="ghost"
          size="sm"
          icon={<ChevronLeft size={16} />}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          aria-label="Pagina anterior"
          className="rounded-md text-muted hover:text-text"
        />

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
            <Button
              key={page}
              type="button"
              variant="ghost"
              onClick={() => onPageChange(page as number)}
              aria-label={`Ir a la pagina ${page}`}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "h-8 min-w-[32px] rounded-md px-2 text-small text-secondary hover:text-text",
                isCurrent && "text-primary font-semibold underline underline-offset-4"
              )}
            >
              {page}
            </Button>
          );
        })}

        <IconButton
          variant="ghost"
          size="sm"
          icon={<ChevronRight size={16} />}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          aria-label="Pagina siguiente"
          className="rounded-md text-muted hover:text-text"
        />
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination };
