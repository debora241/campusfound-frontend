import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none transition-colors placeholder:text-ink-300 focus:border-ink dark:border-line-dark dark:bg-transparent dark:focus:border-white",
          error && "border-alert focus:border-alert",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-alert">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";
