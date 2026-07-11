import { useQuery } from "@tanstack/react-query";
import { ShieldAlert, Phone, AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { parentApi } from "@/lib/parentApi";
import { ApiError } from "@/lib/apiClient";

const statusVariant = { active: "alert", responding: "gold", resolved: "verified" } as const;

export function EmergencyAlerts() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: alerts, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["parent-alerts"],
    queryFn: () => parentApi.listAlerts(accessToken!),
    enabled: !!accessToken,
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load alerts</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">
          {error instanceof ApiError ? error.message : "Check that the backend is running."}
        </p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Emergency alerts"
        description="Real-time notifications involving your children's safety"
        actions={
          <Button variant="destructive" size="sm">
            <Phone className="h-3.5 w-3.5" /> Contact school now
          </Button>
        }
      />

      {isLoading && <p className="py-10 text-center text-sm text-ink-300">Loading…</p>}

      {!isLoading && (alerts ?? []).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center text-sm text-ink-300">
            <ShieldAlert className="mb-2 h-6 w-6" />
            No emergency alerts. Everything looks calm.
          </CardContent>
        </Card>
      ) : (
        (alerts ?? []).map((alert) => (
          <Card key={alert.id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-4 w-4 text-ink-300" />
                <div>
                  <p className="text-sm font-medium">{alert.reason ?? (alert.type === "health" ? "Medical emergency" : "Safety alert")}</p>
                  <p className="text-xs text-ink-300">{alert.childName} · {new Date(alert.time).toLocaleString()}</p>
                </div>
              </div>
              <Badge variant={statusVariant[alert.status]}>{alert.status}</Badge>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
