import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { governmentApi, type BackendGovUniversity } from "@/lib/governmentApi";
import { ApiError } from "@/lib/apiClient";

const columns: ColumnDef<BackendGovUniversity, any>[] = [
  { accessorKey: "name", header: "University" },
  { accessorKey: "region", header: "Region" },
  { accessorKey: "enrolled", header: "Enrolled", cell: ({ getValue }) => (getValue() as number).toLocaleString() },
  { accessorKey: "graduationRate", header: "Graduation rate", cell: ({ getValue }) => `${getValue()}%` },
];

export function GovernmentUniversities() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: universities, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["gov-universities"],
    queryFn: () => governmentApi.universities.list(accessToken!),
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Government to view universities</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load universities</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Universities" description={isLoading ? "Loading…" : `${universities?.length ?? 0} registered universities on the platform`} />
      <DataTable columns={columns} data={universities ?? []} searchPlaceholder="Search universities by name or region…" emptyLabel={isLoading ? "Loading…" : "No universities registered yet."} />
    </div>
  );
}
