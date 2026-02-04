import * as React from "react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator = "/", className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span
                className="text-xs font-normal text-neutral"
                aria-hidden="true"
              >
                {separator}
              </span>
            )}
            {item.href && !item.active ? (
              <a
                href={item.href}
                className="text-xs font-normal text-muted hover:text-text transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  "text-xs",
                  item.active
                    ? "font-medium text-text"
                    : "font-normal text-muted"
                )}
                aria-current={item.active ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
