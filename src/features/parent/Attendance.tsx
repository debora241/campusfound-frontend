import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { parentApi, type BackendAttendanceRecord } from "@/lib/parentApi";
import { ApiError } from "@/lib/apiClient";

const statusVariant = { present: "verified", late: "gold", absent: "alert" } as const;

const columns: ColumnDef<BackendAttendanceRecord, any>[] = [
  { accessorKey: "date", header: "Date", cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString() },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <Badge variant={statusVariant[getValue() as BackendAttendanceRecord["status"]]}>{getValue() as string}</Badge>,
  },
];

export function Attendance() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: children } = useQuery({
    queryKey: ["parent-children"],
    queryFn: () => parentApi.listChildren(accessToken!),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (!selectedId && children && children.length > 0) setSelectedId(children[0].id);
  }, [children, selectedId]);

  const {
    data: attendance,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["parent-attendance", selectedId],
    queryFn: () => parentApi.getAttendance(accessToken!, selectedId!),
    enabled: !!accessToken && !!selectedId,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a Parent to view attendance</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Attendance" description="Daily attendance for your children" />

      <div className="mb-4 flex flex-wrap gap-2">
        {(children ?? []).map((child) => (
          <button
            key={child.id}
            onClick={() => setSelectedId(child.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              selectedId === child.id
                ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink"
                : "border-line text-ink-500 dark:border-line-dark dark:text-ink-300"
            )}
          >
            {child.fullName.split(" ")[0]}
          </button>
        ))}
      </div>

      {isError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-line py-16 text-center dark:border-line-dark">
          <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
          <p className="font-medium">Couldn't load attendance</p>
          <p className="mt-1 max-w-sm text-sm text-ink-300">
            {error instanceof ApiError ? error.message : "Check that the backend is running."}
          </p>
          <Button className="mt-4" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={attendance ?? []}
          searchPlaceholder="Search by date…"
          emptyLabel={isLoading ? "Loading attendance…" : "No attendance recorded yet."}
        />
      )}
    </div>
  );
}
