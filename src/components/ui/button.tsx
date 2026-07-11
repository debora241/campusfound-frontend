import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink text-white hover:bg-ink-700 dark:bg-white dark:text-ink dark:hover:bg-ink-100",
        secondary: "bg-white text-ink border border-line hover:bg-ink-50 dark:bg-transparent dark:text-white dark:border-line-dark dark:hover:bg-white/5",
        gold: "bg-gold text-ink hover:bg-gold-dark hover:text-white",
        ghost: "hover:bg-ink-50 dark:hover:bg-white/5",
        destructive: "bg-alert text-white hover:bg-alert/90",
        link: "text-ink underline-offset-4 hover:underline dark:text-white",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
