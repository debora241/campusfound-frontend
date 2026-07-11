import { GraduationCap } from "lucide-react";
import type { ReactNode } from "react";

export function AuthLayout({
  title,
  subtitle,
  children,
  step,
  totalSteps,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  step?: number;
  totalSteps?: number;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 dark:bg-paper-dark">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="seal mb-4 !h-12 !w-12 !border-ink !text-ink dark:!border-white dark:!text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink-300">{subtitle}</p>}
        </div>

        {step && totalSteps && (
          <div className="mb-6 flex gap-1.5" role="progressbar" aria-valuenow={step} aria-valuemax={totalSteps}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i < step ? "bg-gold" : "bg-ink-50 dark:bg-white/10"}`}
              />
            ))}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
