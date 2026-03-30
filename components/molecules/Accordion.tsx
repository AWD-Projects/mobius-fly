import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, className }, ref) => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);

    const toggleItem = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-3", className)}>
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border-b border-border pb-4"
            >
              <button
                onClick={() => toggleItem(index)}
                className={cn(
                  "w-full flex items-center justify-between gap-4 text-left transition-all",
                  isOpen && "pb-3"
                )}
              >
                <span className="text-text text-body font-medium tracking-tight leading-snug">
                  {item.question}
                </span>
                <ChevronDown
                  size={20}
                  strokeWidth={1}
                  className={cn(
                    "text-text flex-shrink-0 transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && (
                <div className="overflow-hidden animate-in fade-in duration-300">
                  <p className="text-text/70 text-small font-normal leading-relaxed pr-8">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

Accordion.displayName = "Accordion";

export { Accordion };
