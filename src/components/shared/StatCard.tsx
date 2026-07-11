import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-ink-300">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold">{value}</p>
          {trend && (
            <p className={cn("mt-1 text-xs", trendUp ? "text-verified" : "text-alert")}>{trend}</p>
          )}
        </div>
        <div className="rounded-md bg-ink-50 p-2 dark:bg-white/5">
          <Icon className="h-4 w-4 text-ink-500 dark:text-ink-300" />
        </div>
      </CardContent>
    </Card>
  );
}
