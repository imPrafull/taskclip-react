import * as React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "secondary";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border px-3 py-1 transition-colors file:border-0 font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          variant === "default" && "border-border bg-background text-base sm:text-lg shadow-sm",
          variant === "secondary" && "border-border-dark bg-input text-lg sm:text-xl shadow-none",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, type InputProps };
