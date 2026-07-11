import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { adminApi, type BackendSystemUser } from "@/lib/adminApi";
import { ApiError } from "@/lib/apiClient";

export function UsersRbac() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();

  const { data: users, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminApi.users.list(accessToken!),
    enabled: !!accessToken,
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.users.toggle(accessToken!, id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(updated.isActive ? "User reactivated" : "User disabled");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't update user"),
  });

  const columns: ColumnDef<BackendSystemUser, any>[] = [
    { accessorKey: "name", header: "User" },
    { id: "contact", header: "Contact", cell: ({ row }) => row.original.email ?? row.original.phone ?? "—" },
    { accessorKey: "dashboardRole", header: "Role", cell: ({ getValue }) => (getValue() as string).replace("_", " ") },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ getValue }) => <Badge variant={getValue() ? "verified" : "alert"}>{getValue() ? "active" : "disabled"}</Badge>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="secondary" size="sm" onClick={() => toggleMutation.mutate(row.original.id)}>
          {row.original.isActive ? "Disable" : "Reactivate"}
        </Button>
      ),
    },
  ];

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Super Admin to manage users</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load users</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Users & RBAC" description={isLoading ? "Loading…" : `${users?.length ?? 0} users across all roles`} />
      <DataTable columns={columns} data={users ?? []} searchPlaceholder="Search users by name, email, or role…" emptyLabel={isLoading ? "Loading…" : "No users yet."} />
    </div>
  );
}
