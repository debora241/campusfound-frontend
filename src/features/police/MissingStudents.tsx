import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { policeApi, type BackendMissingCase } from "@/lib/policeApi";
import { ApiError } from "@/lib/apiClient";

export function MissingStudents() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();

  const { data: cases, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["police-missing"],
    queryFn: () => policeApi.missing.list(accessToken!),
    enabled: !!accessToken,
  });

  const foundMutation = useMutation({
    mutationFn: (id: string) => policeApi.missing.markFound(accessToken!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["police-missing"] });
      toast.success("Case marked as found");
    },
  });

  const columns: ColumnDef<BackendMissingCase, any>[] = [
    { id: "name", header: "Student", cell: ({ row }) => row.original.student.fullName },
    { id: "school", header: "School", cell: ({ row }) => row.original.student.school?.name ?? "—" },
    { accessorKey: "lastSeen", header: "Last seen", cell: ({ getValue }) => new Date(getValue() as string).toLocaleString() },
    { accessorKey: "lastLocation", header: "Last known location" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <Badge variant={getValue() === "found" ? "verified" : "alert"}>{getValue() as string}</Badge>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        row.original.status === "searching" ? (
          <Button size="sm" variant="secondary" onClick={() => foundMutation.mutate(row.original.id)}>
            Mark found
          </Button>
        ) : null,
    },
  ];

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Police to view missing student cases</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load missing student cases</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Missing students" description="Active search cases and recovery history" />
      <DataTable columns={columns} data={cases ?? []} searchPlaceholder="Search by name or school…" emptyLabel={isLoading ? "Loading…" : "No missing student cases."} />
    </div>
  );
}
