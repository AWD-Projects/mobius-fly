import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(props.checked || false);

    React.useEffect(() => {
      setIsChecked(!!props.checked);
    }, [props.checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(e.target.checked);
      props.onChange?.(e);
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className={cn(
            "peer h-5 w-5 shrink-0 rounded cursor-pointer appearance-none border",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-40",
            isChecked ? "bg-primary border-primary" : "bg-surface border-border",
            className
          )}
          ref={ref}
          {...props}
          onChange={handleChange}
        />
        <Check
          className={cn(
            "absolute left-0.5 top-0.5 h-4 w-4 pointer-events-none text-white transition-opacity",
            isChecked ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
