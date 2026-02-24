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
              style={{
                borderBottom: "1px solid #E0E0DE",
                paddingBottom: "16px",
              }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between gap-4 text-left transition-all"
                style={{
                  paddingBottom: isOpen ? "12px" : "0",
                }}
              >
                <span
                  style={{
                    color: "#39424E",
                    fontSize: "15px",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    lineHeight: "1.4",
                  }}
                >
                  {item.question}
                </span>
                <ChevronDown
                  size={20}
                  strokeWidth={1}
                  style={{
                    color: "#39424E",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    flexShrink: 0,
                  }}
                />
              </button>

              {isOpen && (
                <div
                  className="overflow-hidden"
                  style={{
                    animation: "slideDown 0.3s ease-out",
                  }}
                >
                  <p
                    style={{
                      color: "#39424E",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "1.6",
                      opacity: 0.7,
                      paddingRight: "32px",
                    }}
                  >
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
