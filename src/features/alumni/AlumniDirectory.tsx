import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { alumniApi, type BackendAlumniProfile } from "@/lib/alumniApi";
import { ApiError } from "@/lib/apiClient";

const columns: ColumnDef<BackendAlumniProfile, any>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "graduationYear", header: "Class of", cell: ({ getValue }) => (getValue() as number) ?? "—" },
  { accessorKey: "program", header: "Program", cell: ({ getValue }) => (getValue() as string) ?? "—" },
  { accessorKey: "institution", header: "Institution", cell: ({ getValue }) => (getValue() as string) ?? "—" },
];

export function AlumniDirectory() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: alumni, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["alumni-network"],
    queryFn: () => alumniApi.network.list(accessToken!),
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Alumni to view the network</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load the alumni network</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Network" description={isLoading ? "Loading…" : `${alumni?.length ?? 0} graduates in the network`} />
      <DataTable columns={columns} data={alumni ?? []} searchPlaceholder="Search by name, program, or institution…" emptyLabel={isLoading ? "Loading…" : "No graduates recorded yet."} />
    </div>
  );
}
