import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { studentApi, type StudentAssignment } from "@/lib/studentApi";
import { ApiError } from "@/lib/apiClient";

const statusVariant = { scheduled: "neutral", in_progress: "gold", graded: "verified" } as const;

const columns: ColumnDef<StudentAssignment, any>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "dueDate", header: "Due", cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString() },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <Badge variant={statusVariant[getValue() as StudentAssignment["status"]]}>{(getValue() as string).replace("_", " ")}</Badge>,
  },
];

export function Assignments() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["student-assignments"],
    queryFn: () => studentApi.getAssignments(accessToken!),
    enabled: !!accessToken,
  });

  return (
    <div>
      <PageHeader title="Assignments" description="Upcoming exams and coursework assigned to your class" />
      {isError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-line py-16 text-center dark:border-line-dark">
          <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
          <p className="font-medium">Couldn't load assignments</p>
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
          data={data ?? []}
          searchPlaceholder="Search assignments…"
          emptyLabel={isLoading ? "Loading assignments…" : "Nothing assigned right now — check back closer to term end."}
        />
      )}
    </div>
  );
}
