import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
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
          type="radio"
          className={cn(
            "peer h-5 w-5 shrink-0 rounded-full cursor-pointer appearance-none border bg-surface",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-40",
            isChecked ? "border-primary" : "border-border",
            className
          )}
          ref={ref}
          {...props}
          onChange={handleChange}
        />
        <span
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-all",
            isChecked ? "scale-100 opacity-100" : "scale-75 opacity-0"
          )}
        />
      </div>
    );
  }
);

Radio.displayName = "Radio";

export { Radio };
