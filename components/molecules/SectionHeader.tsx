import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  size?: "section" | "page";
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ title, subtitle, align = "left", size = "section", className, ...props }, ref) => {
    const titleClass = size === "page" ? "text-h1" : "text-h3";
    const subtitleClass = size === "page" ? "text-body" : "text-small";
    const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2", alignment, className)}
        {...props}
      >
        <h2 className={cn(titleClass, "font-medium tracking-[-0.008em] text-text")}>
          {title}
        </h2>
        {subtitle && (
          <p className={cn(subtitleClass, "text-muted tracking-[0.005em] max-w-2xl")}>
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = "SectionHeader";

export { SectionHeader };
