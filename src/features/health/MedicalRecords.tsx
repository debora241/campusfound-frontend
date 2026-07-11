import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { healthApi, type BackendMedicalRecord } from "@/lib/healthApi";
import { ApiError } from "@/lib/apiClient";

const columns: ColumnDef<BackendMedicalRecord, any>[] = [
  { id: "student", header: "Student", cell: ({ row }) => row.original.student.fullName },
  { id: "school", header: "School", cell: ({ row }) => row.original.student.school?.name ?? "—" },
  { accessorKey: "bloodGroup", header: "Blood group", cell: ({ getValue }) => (getValue() as string) ?? "—" },
  { accessorKey: "allergies", header: "Allergies", cell: ({ getValue }) => (getValue() as string) ?? "—" },
  { accessorKey: "lastUpdated", header: "Last updated", cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString() },
];

export function MedicalRecords() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: records, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["health-records"],
    queryFn: () => healthApi.records.list(accessToken!),
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a Health Partner to view medical records</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load medical records</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Medical records" description={isLoading ? "Loading…" : `${records?.length ?? 0} records across partner schools`} />
      <DataTable columns={columns} data={records ?? []} searchPlaceholder="Search by student or school…" emptyLabel={isLoading ? "Loading…" : "No medical records yet."} />
    </div>
  );
}
