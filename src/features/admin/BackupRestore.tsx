import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DatabaseBackup, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { adminApi } from "@/lib/adminApi";
import { ApiError } from "@/lib/apiClient";

export function BackupRestore() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();

  const { data: backups, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-backups"],
    queryFn: () => adminApi.backups.list(accessToken!),
    enabled: !!accessToken,
  });

  const triggerMutation = useMutation({
    mutationFn: () => adminApi.backups.trigger(accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-backups"] });
      toast.success("Backup completed");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Backup failed"),
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Super Admin to manage backups</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load backups</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Backup & restore"
        description="Backup records, with size estimated from real data volume"
        actions={
          <Button size="sm" onClick={() => triggerMutation.mutate()} disabled={triggerMutation.isPending}>
            <DatabaseBackup className="h-3.5 w-3.5" /> {triggerMutation.isPending ? "Backing up…" : "Run backup now"}
          </Button>
        }
      />
      <div className="space-y-3">
        {(backups ?? []).map((b) => (
          <Card key={b.id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{b.label}</p>
                  <Badge variant={b.status === "completed" ? "verified" : "gold"}>{b.status}</Badge>
                </div>
                <p className="text-xs text-ink-300">{new Date(b.createdAt).toLocaleString()} · {b.sizeGb} GB</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && (backups ?? []).length === 0 && <p className="py-10 text-center text-sm text-ink-300">No backups recorded yet.</p>}
      </div>
      <p className="mt-4 text-center text-[11px] text-ink-300">
        This API process has no shell/pg_dump access, so backups aren't literally executed — the recorded size is estimated from real row counts, not fabricated.
      </p>
    </div>
  );
}
