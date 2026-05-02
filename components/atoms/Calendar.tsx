"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  hideNavigation,
  ...props
}: CalendarProps) {
  const isDropdown = captionLayout?.startsWith("dropdown");
  const navHidden = hideNavigation ?? isDropdown;

  return (
    <DayPicker
      locale={es}
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      hideNavigation={navHidden}
      className={cn("p-2", className)}
      classNames={{
        months: "relative flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-3",
        month_caption: "flex justify-center items-center h-9",
        caption_label: cn(
          "text-small font-medium text-text",
          isDropdown && "sr-only"
        ),
        dropdowns: "flex items-center gap-2 text-small text-text",
        dropdown:
          "bg-surface border border-border rounded-sm px-2 py-1 text-small text-text focus:outline-none focus:border-text",
        nav: "absolute top-1 inset-x-1 flex items-center justify-between z-10",
        button_previous: cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-sm bg-transparent text-text",
          "hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed"
        ),
        button_next: cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-sm bg-transparent text-text",
          "hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-muted rounded-sm w-9 font-normal text-caption uppercase tracking-wide",
        week: "flex w-full mt-1",
        day: "relative p-0 text-center text-small focus-within:relative focus-within:z-20",
        day_button: cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-sm text-text",
          "hover:bg-background focus:outline-none focus:bg-background"
        ),
        selected:
          "[&_button]:bg-primary [&_button]:text-white [&_button]:hover:bg-primary",
        today: "[&_button]:border [&_button]:border-primary",
        outside: "[&_button]:text-muted [&_button]:opacity-50",
        disabled: "[&_button]:opacity-30 [&_button]:cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass, ...chevronProps }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className={cn("h-4 w-4", chevronClass)} {...chevronProps} />;
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
