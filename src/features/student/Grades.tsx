import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { studentApi, type StudentGrade } from "@/lib/studentApi";
import { ApiError } from "@/lib/apiClient";

const columns: ColumnDef<StudentGrade, any>[] = [
  { accessorKey: "examName", header: "Exam" },
  { accessorKey: "date", header: "Date", cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString() },
  {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
      const g = row.original;
      const pct = Math.round((g.score / g.maxScore) * 100);
      return <Badge variant={pct >= 50 ? "verified" : "alert"}>{g.score}/{g.maxScore} ({pct}%)</Badge>;
    },
  },
];

export function Grades() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["student-grades"],
    queryFn: () => studentApi.getGrades(accessToken!),
    enabled: !!accessToken,
  });

  const average =
    data && data.length > 0
      ? Math.round((data.reduce((sum, g) => sum + g.score / g.maxScore, 0) / data.length) * 100)
      : null;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load grades</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">
          {error instanceof ApiError ? error.message : "Check that the backend is running."}
        </p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Grades" description="Results for every graded exam on record" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Exams graded" value={String(data?.length ?? 0)} icon={TrendingUp} />
        <StatCard label="Average score" value={average != null ? `${average}%` : "—"} icon={TrendingUp} />
        <StatCard
          label="Best result"
          value={data && data.length > 0 ? `${Math.round(Math.max(...data.map((g) => g.score / g.maxScore)) * 100)}%` : "—"}
          icon={TrendingUp}
        />
      </div>
      <DataTable
        columns={columns}
        data={data ?? []}
        searchPlaceholder="Search exams…"
        emptyLabel={isLoading ? "Loading grades…" : "No graded exams yet."}
      />
    </div>
  );
}
