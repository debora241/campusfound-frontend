import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { policeApi, type BackendSosAlert } from "@/lib/policeApi";
import { ApiError } from "@/lib/apiClient";

const statusVariant = { active: "alert", responding: "gold", resolved: "verified" } as const;

export function SosAlerts() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();

  const { data: alerts, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["police-sos"],
    queryFn: () => policeApi.sos.list(accessToken!),
    enabled: !!accessToken,
  });

  const advanceMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => policeApi.sos.updateStatus(accessToken!, id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["police-sos"] });
      toast.success(variables.status === "responding" ? "Unit dispatched" : "Alert resolved");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't update alert"),
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Police to view SOS alerts</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load SOS alerts</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="SOS alerts" description={isLoading ? "Loading…" : `${(alerts ?? []).filter((a) => a.status !== "resolved").length} unresolved alerts`} />
      <div className="space-y-3">
        {(alerts ?? []).map((a: BackendSosAlert) => (
          <Card key={a.id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{a.student.fullName}</p>
                  <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-ink-300">{a.student.school?.name ?? "—"}</p>
                <p className="text-xs text-ink-300">{a.location} · {new Date(a.triggeredAt).toLocaleString()}</p>
              </div>
              {a.status !== "resolved" && (
                <Button
                  variant={a.status === "active" ? "destructive" : "secondary"}
                  size="sm"
                  onClick={() => advanceMutation.mutate({ id: a.id, status: a.status === "active" ? "responding" : "resolved" })}
                >
                  {a.status === "active" ? "Dispatch unit" : "Mark resolved"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {!isLoading && (alerts ?? []).length === 0 && <p className="py-10 text-center text-sm text-ink-300">No SOS alerts on record.</p>}
      </div>
    </div>
  );
}
