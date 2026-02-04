import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Dropdown Menu Context
interface DropdownMenuContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used within a DropdownMenu");
  }
  return context;
}

// Root
export interface DropdownMenuProps {
  children: React.ReactNode;
}

function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (isOpen && triggerRef.current && !triggerRef.current.contains(target)) {
        const menu = document.querySelector("[data-dropdown-content]");
        if (menu && !menu.contains(target)) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

// Trigger
export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ children, className, asChild, ...props }, forwardedRef) => {
    const { isOpen, setIsOpen, triggerRef } = useDropdownMenu();
    const localRef = React.useRef<HTMLButtonElement>(null);

    // Sync refs in effect
    React.useEffect(() => {
      const node = localRef.current;
      triggerRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    });

    const handleClick = (e: React.MouseEvent) => {
      if (asChild && React.isValidElement(children)) {
        const childProps = (children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props;
        childProps.onClick?.(e);
      }
      setIsOpen(!isOpen);
    };

    if (asChild && React.isValidElement(children)) {
      // eslint-disable-next-line react-hooks/refs
      return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        ref: localRef,
        onClick: handleClick,
        "aria-expanded": isOpen,
        "aria-haspopup": true,
      });
    }

    return (
      <button
        ref={localRef}
        type="button"
        className={cn(
          "inline-flex items-center justify-center p-1 rounded text-[#666666] hover:text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors",
          className
        )}
        onClick={handleClick}
        aria-expanded={isOpen}
        aria-haspopup={true}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

// Content
export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ children, className, align = "end", sideOffset = 4, ...props }, ref) => {
    const { isOpen } = useDropdownMenu();

    if (!isOpen) return null;

    const alignmentClasses = {
      start: "left-0",
      center: "left-1/2 -translate-x-1/2",
      end: "right-0",
    };

    return (
      <div
        ref={ref}
        data-dropdown-content
        className={cn(
          "absolute z-50 min-w-[160px] overflow-hidden rounded-lg border border-[#E5E5E5] bg-white py-1 shadow-lg",
          alignmentClasses[align],
          className
        )}
        style={{ marginTop: sideOffset }}
        role="menu"
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

// Item
export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "default" | "danger";
}

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ children, className, icon: Icon, variant = "default", onClick, ...props }, ref) => {
    const { setIsOpen } = useDropdownMenu();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      setIsOpen(false);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        className={cn(
          "flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-medium transition-colors",
          variant === "default" && "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#0A0A0A]",
          variant === "danger" && "text-[#D32F2F] hover:bg-[#FFEBEE]",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {children}
      </button>
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

// Separator
export interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("my-1 h-px bg-[#E5E5E5]", className)}
        role="separator"
        {...props}
      />
    );
  }
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
