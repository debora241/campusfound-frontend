import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Siren, MapPinned, ShieldAlert, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { policeApi } from "@/lib/policeApi";

const statusVariant = { active: "alert", responding: "gold", resolved: "verified" } as const;

export function PoliceDashboard() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const enabled = !!accessToken;

  const { data: alerts } = useQuery({ queryKey: ["police-sos"], queryFn: () => policeApi.sos.list(accessToken!), enabled });
  const { data: missing } = useQuery({ queryKey: ["police-missing"], queryFn: () => policeApi.missing.list(accessToken!), enabled });
  const { data: incidents } = useQuery({ queryKey: ["police-incidents"], queryFn: () => policeApi.incidents.list(accessToken!), enabled });
  const { data: responses } = useQuery({ queryKey: ["police-responses"], queryFn: () => policeApi.responses.list(accessToken!), enabled });

  const dispatchMutation = useMutation({
    mutationFn: (id: string) => policeApi.sos.updateStatus(accessToken!, id, "responding"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["police-sos"] });
      toast.success("Unit dispatched");
    },
  });

  const activeAlerts = (alerts ?? []).filter((a) => a.status !== "resolved");
  const searchingCount = (missing ?? []).filter((m) => m.status === "searching").length;
  const openIncidents = (incidents ?? []).filter((i) => i.status !== "closed").length;
  const avgResponse = (responses ?? []).length > 0
    ? Math.round((responses ?? []).reduce((s, r) => s + r.responseTimeMinutes, 0) / (responses ?? []).length)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Emergency dashboard" description="Real-time school safety monitoring" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active SOS alerts" value={String(activeAlerts.length)} icon={Siren} trend={activeAlerts.length > 0 ? "Immediate attention" : "All clear"} trendUp={activeAlerts.length === 0} />
        <StatCard label="Students missing" value={String(searchingCount)} icon={MapPinned} />
        <StatCard label="Open incidents" value={String(openIncidents)} icon={ShieldAlert} />
        <StatCard label="Avg. response time" value={avgResponse != null ? `${avgResponse} min` : "—"} icon={Clock} />
      </div>

      <Card className="border-alert/40 bg-alert-light/40">
        <CardHeader>
          <CardTitle className="text-alert">Active SOS alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeAlerts.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-300">No active alerts right now.</p>
          ) : (
            activeAlerts.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-md border border-alert/30 bg-white p-3 text-sm dark:bg-transparent">
                <div>
                  <p className="font-medium">{a.student.fullName}</p>
                  <p className="text-xs text-ink-300">{a.location} · {new Date(a.triggeredAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
                  {a.status === "active" && (
                    <Button size="sm" variant="destructive" onClick={() => dispatchMutation.mutate(a.id)}>
                      Dispatch
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent incidents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(incidents ?? []).slice(0, 3).map((i) => (
            <div key={i.id} className="flex items-center justify-between rounded-md border border-line p-3 text-sm dark:border-line-dark">
              <div>
                <p className="font-medium">{i.title}</p>
                <p className="text-xs text-ink-300">{i.location} · {new Date(i.reportedAt).toLocaleDateString()}</p>
              </div>
              <Badge variant={i.severity === "high" ? "alert" : i.severity === "medium" ? "gold" : "neutral"}>{i.severity}</Badge>
            </div>
          ))}
          {(incidents ?? []).length === 0 && <p className="text-sm text-ink-300">No incidents on file.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
