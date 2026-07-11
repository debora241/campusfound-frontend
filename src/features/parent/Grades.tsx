import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { parentApi } from "@/lib/parentApi";
import { ApiError } from "@/lib/apiClient";

export function Grades() {
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

  const { data: grades, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["parent-grades", selectedId],
    queryFn: () => parentApi.getGrades(accessToken!, selectedId!),
    enabled: !!accessToken && !!selectedId,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a Parent to view grades</p>
      </div>
    );
  }

  const selectedChild = children?.find((c) => c.id === selectedId);
  const average =
    grades && grades.length > 0 ? Math.round((grades.reduce((s, g) => s + g.score / g.maxScore, 0) / grades.length) * 100) : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Grades" description="Exam results for your children" />

      <div className="flex flex-wrap gap-2">
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
          <p className="font-medium">Couldn't load grades</p>
          <p className="mt-1 max-w-sm text-sm text-ink-300">
            {error instanceof ApiError ? error.message : "Check that the backend is running."}
          </p>
          <Button className="mt-4" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gold-light" />
              <CardTitle className="text-sm font-semibold text-ink dark:text-white">{selectedChild?.fullName ?? "—"}</CardTitle>
            </div>
            {average != null && <Badge variant={average >= 50 ? "verified" : "alert"}>{average}% average</Badge>}
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading && <p className="py-6 text-center text-sm text-ink-300">Loading…</p>}
            {(grades ?? []).map((g) => {
              const pct = Math.round((g.score / g.maxScore) * 100);
              return (
                <div key={g.id} className="flex items-center justify-between rounded-md border border-line p-3 text-sm dark:border-line-dark">
                  <div>
                    <p className="font-medium">{g.examName}</p>
                    <p className="text-xs text-ink-300">{new Date(g.date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={pct >= 50 ? "verified" : "alert"}>{g.score}/{g.maxScore} ({pct}%)</Badge>
                </div>
              );
            })}
            {!isLoading && (grades ?? []).length === 0 && (
              <p className="py-6 text-center text-sm text-ink-300">No graded exams yet for this child.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
