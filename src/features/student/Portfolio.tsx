import { Briefcase } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PORTFOLIO_ITEMS } from "./data";

export function Portfolio() {
  return (
    <div>
      <PageHeader title="Portfolio" description="Projects, awards, and extracurricular achievements" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PORTFOLIO_ITEMS.map((item) => (
          <Card key={item.id}>
            <CardContent>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-ink-50 p-2 dark:bg-white/5">
                    <Briefcase className="h-4 w-4 text-ink-500 dark:text-ink-300" />
                  </div>
                  <p className="font-semibold">{item.title}</p>
                </div>
                <Badge variant="neutral">{item.category}</Badge>
              </div>
              <p className="mt-3 text-sm text-ink-500 dark:text-ink-300">{item.description}</p>
              <p className="mt-2 text-xs text-ink-300">{item.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
