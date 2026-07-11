import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { policeApi, type BackendResponseRecord } from "@/lib/policeApi";
import { ApiError } from "@/lib/apiClient";

const columns: ColumnDef<BackendResponseRecord, any>[] = [
  { id: "incident", header: "Incident", cell: ({ row }) => row.original.incident.title },
  { accessorKey: "respondingUnit", header: "Responding unit" },
  { accessorKey: "responseTimeMinutes", header: "Response time", cell: ({ getValue }) => `${getValue()} min` },
  { accessorKey: "outcome", header: "Outcome" },
];

export function ResponseHistory() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: responses, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["police-responses"],
    queryFn: () => policeApi.responses.list(accessToken!),
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Police to view response history</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load response history</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Response history" description="Completed responses and outcomes" />
      <DataTable columns={columns} data={responses ?? []} searchPlaceholder="Search response history…" emptyLabel={isLoading ? "Loading…" : "No responses recorded yet."} />
    </div>
  );
}
