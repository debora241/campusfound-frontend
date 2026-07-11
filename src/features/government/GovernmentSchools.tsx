import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { governmentApi, type BackendGovSchool } from "@/lib/governmentApi";
import { ApiError } from "@/lib/apiClient";

const complianceVariant = { compliant: "verified", under_review: "gold", non_compliant: "alert" } as const;

const columns: ColumnDef<BackendGovSchool, any>[] = [
  { accessorKey: "name", header: "School" },
  { accessorKey: "region", header: "Region" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "students", header: "Students", cell: ({ getValue }) => (getValue() as number).toLocaleString() },
  {
    accessorKey: "compliance",
    header: "Compliance",
    cell: ({ getValue }) => <Badge variant={complianceVariant[getValue() as BackendGovSchool["compliance"]]}>{(getValue() as string).replace("_", " ")}</Badge>,
  },
];

export function GovernmentSchools() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: schools, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["gov-schools"],
    queryFn: () => governmentApi.schools.list(accessToken!),
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Government to view schools</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load schools</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Schools" description={isLoading ? "Loading…" : `${schools?.length ?? 0} registered schools on the platform`} />
      <DataTable columns={columns} data={schools ?? []} searchPlaceholder="Search schools by name or region…" emptyLabel={isLoading ? "Loading…" : "No schools registered yet."} />
    </div>
  );
}
