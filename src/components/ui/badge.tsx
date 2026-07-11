import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-ink-50 text-ink-500 dark:bg-white/5 dark:text-ink-300",
        verified: "bg-verified-light text-verified",
        gold: "bg-gold-light text-gold-dark",
        alert: "bg-alert-light text-alert",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** Signature element: the verification seal used wherever a record
 * (diploma, result, credential) is blockchain-confirmed. */
export function VerificationSeal({
  size = "md",
  label = "Verified",
}: {
  size?: "sm" | "md";
  label?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-verified">
      <span
        className={cn(
          "seal",
          size === "sm" ? "h-5 w-5 border" : "h-8 w-8 border-2",
          "!border-verified !text-verified"
        )}
      >
        <CheckCircle2 className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} strokeWidth={2.5} />
      </span>
      <span className="text-xs font-medium">{label}</span>
    </span>
  );
}
