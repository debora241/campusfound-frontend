import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { adminApi, type BackendAuditLogEntry } from "@/lib/adminApi";
import { ApiError } from "@/lib/apiClient";

const columns: ColumnDef<BackendAuditLogEntry, any>[] = [
  { accessorKey: "createdAt", header: "Time", cell: ({ getValue }) => new Date(getValue() as string).toLocaleString() },
  { accessorKey: "actor", header: "Actor" },
  { accessorKey: "action", header: "Action" },
  { accessorKey: "target", header: "Target" },
];

export function AuditLogs() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: logs, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: () => adminApi.auditLogs.list(accessToken!),
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Super Admin to view audit logs</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load audit logs</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Audit logs" description="Full record of privileged actions across the platform" />
      <DataTable columns={columns} data={logs ?? []} searchPlaceholder="Search by actor, action, or target…" emptyLabel={isLoading ? "Loading…" : "No audit entries yet."} />
    </div>
  );
}
