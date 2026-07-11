import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { adminApi, type BackendManagedInstitution } from "@/lib/adminApi";
import { ApiError } from "@/lib/apiClient";

export function MultiSchoolManagement() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();

  const { data: institutions, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-institutions"],
    queryFn: () => adminApi.institutions.list(accessToken!),
    enabled: !!accessToken,
  });

  const toggleMutation = useMutation({
    mutationFn: (inst: BackendManagedInstitution) =>
      adminApi.institutions.toggle(accessToken!, inst.type === "School" ? "school" : "university", inst.id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-institutions"] });
      toast.success(updated.active ? `${updated.name} reactivated` : `${updated.name} suspended`);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't update institution"),
  });

  const columns: ColumnDef<BackendManagedInstitution, any>[] = [
    { accessorKey: "name", header: "Institution" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "region", header: "Region" },
    { accessorKey: "users", header: "Users", cell: ({ getValue }) => (getValue() as number).toLocaleString() },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ getValue }) => <Badge variant={getValue() ? "verified" : "alert"}>{getValue() ? "active" : "suspended"}</Badge>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="secondary" size="sm" onClick={() => toggleMutation.mutate(row.original)}>
          {row.original.active ? "Suspend" : "Reactivate"}
        </Button>
      ),
    },
  ];

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Super Admin to manage institutions</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load institutions</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Multi-school management" description={isLoading ? "Loading…" : `${institutions?.length ?? 0} institutions on the platform`} />
      <DataTable columns={columns} data={institutions ?? []} searchPlaceholder="Search institutions…" emptyLabel={isLoading ? "Loading…" : "No institutions registered yet."} />
    </div>
  );
}
