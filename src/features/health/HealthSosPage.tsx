import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldAlert, Phone, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { healthApi, type BackendHealthSos } from "@/lib/healthApi";
import { ApiError } from "@/lib/apiClient";

const statusVariant = { active: "alert", responding: "gold", resolved: "verified" } as const;

export function HealthSosPage() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();

  const { data: alerts, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["health-sos"],
    queryFn: () => healthApi.sos.list(accessToken!),
    enabled: !!accessToken,
  });

  const advanceMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => healthApi.sos.updateStatus(accessToken!, id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["health-sos"] });
      toast.success(variables.status === "responding" ? "Medical team dispatched" : "Case resolved");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't update alert"),
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a Health Partner to view medical emergencies</p>
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
    <div className="space-y-4">
      <PageHeader
        title="SOS button"
        description="Incoming medical emergency alerts from schools and parents"
        actions={
          <Button variant="destructive" size="sm">
            <Phone className="h-3.5 w-3.5" /> Emergency line
          </Button>
        }
      />
      {(alerts ?? []).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center text-sm text-ink-300">
            <ShieldAlert className="mb-2 h-6 w-6" />
            {isLoading ? "Loading…" : "No emergency alerts. Everything looks calm."}
          </CardContent>
        </Card>
      ) : (
        (alerts ?? []).map((a: BackendHealthSos) => (
          <Card key={a.id} className={a.status !== "resolved" ? "border-alert/40" : undefined}>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className={`h-4 w-4 ${a.status !== "resolved" ? "text-alert" : "text-ink-300"}`} />
                <div>
                  <p className="font-medium">{a.student.fullName}</p>
                  <p className="text-xs text-ink-300">
                    {a.student.school?.name ?? "—"} · {a.reason ?? "No reason given"} · {new Date(a.triggeredAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
                {a.status !== "resolved" && (
                  <Button
                    size="sm"
                    variant={a.status === "active" ? "destructive" : "secondary"}
                    onClick={() => advanceMutation.mutate({ id: a.id, status: a.status === "active" ? "responding" : "resolved" })}
                  >
                    {a.status === "active" ? "Dispatch team" : "Mark resolved"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
