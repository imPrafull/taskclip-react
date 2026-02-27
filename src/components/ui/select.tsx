import React from "react";
import { cn } from "../../lib/utils";

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ className, children, ...props }) => {
  return (
    <select
      className={cn(
        "w-full px-3 py-2 bg-background border border-border rounded-lg shadow-sm text-foreground placeholder:text-muted-foreground font-medium focus:outline-none focus:ring-2 focus:ring-[#58419f] cursor-pointer",
        "text-base sm:text-lg", // Default text sizes
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};

export { Select, type SelectProps };