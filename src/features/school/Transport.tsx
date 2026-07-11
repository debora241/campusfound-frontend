import { Bus, Home } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TRANSPORT_ROUTES } from "./data";

export function Transport() {
  return (
    <div className="space-y-6">
      <PageHeader title="Transport & hostels" description="Live route status and boarding overview" />

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink-500 dark:text-ink-300">
          <Bus className="h-4 w-4" /> Bus routes
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TRANSPORT_ROUTES.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{r.route}</p>
                  <p className="text-xs text-ink-300">Driver: {r.driver} · {r.students} students</p>
                </div>
                <Badge variant={r.status === "on-time" ? "verified" : "alert"}>{r.status.replace("-", " ")}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink-500 dark:text-ink-300">
          <Home className="h-4 w-4" /> Hostels
        </h2>
        <Card>
          <CardContent className="flex flex-col items-center py-10 text-center text-sm text-ink-300">
            <Home className="mb-2 h-6 w-6" />
            This school doesn't operate boarding hostels this term.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
