import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { teacherApi } from "@/lib/teacherApi";
import { ApiError } from "@/lib/apiClient";

export function Grading() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [examId, setExamId] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});

  const { data: assignments } = useQuery({
    queryKey: ["teacher-assignments"],
    queryFn: () => teacherApi.getAssignments(accessToken!),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (!examId && assignments && assignments.length > 0) setExamId(assignments[0].id);
  }, [assignments, examId]);

  const { data: grades, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["teacher-assignment-grades", examId],
    queryFn: () => teacherApi.getAssignmentGrades(accessToken!, examId!),
    enabled: !!accessToken && !!examId,
  });

  const saveMutation = useMutation({
    mutationFn: ({ studentId, score }: { studentId: string; score: number }) =>
      teacherApi.gradeStudent(accessToken!, examId!, { studentId, score, maxScore: 100 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-assignment-grades", examId] });
      queryClient.invalidateQueries({ queryKey: ["teacher-dashboard"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't save grade"),
  });

  const activeAssignment = assignments?.find((a) => a.id === examId);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load the gradebook</p>
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
    <div>
      <PageHeader
        title="Grading"
        description={activeAssignment ? `${activeAssignment.title} — ${activeAssignment.className ?? ""}` : "Select an assignment"}
        actions={
          <select
            className="h-9 rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-ink dark:border-line-dark dark:bg-transparent dark:focus:border-white"
            value={examId ?? ""}
            onChange={(e) => setExamId(e.target.value)}
          >
            {(assignments ?? []).map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        }
      />

      <div className="overflow-x-auto rounded-lg border border-line dark:border-line-dark">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 dark:bg-white/5">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-ink-500 dark:text-ink-300">Student</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-ink-500 dark:text-ink-300">Score (/100)</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-sm text-ink-300">Loading…</td>
              </tr>
            )}
            {(grades ?? []).map((row, i) => {
              const draft = edits[row.studentId];
              const value = draft !== undefined ? draft : row.score != null ? String(row.score) : "";
              return (
                <tr key={row.studentId} className={i !== 0 ? "border-t border-line dark:border-line-dark" : ""}>
                  <td className="px-4 py-2.5 font-medium">{row.studentName}</td>
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      min={0}
                      max={row.maxScore}
                      value={value}
                      placeholder="—"
                      onChange={(e) => setEdits((prev) => ({ ...prev, [row.studentId]: e.target.value }))}
                      onBlur={() => {
                        const num = Number(edits[row.studentId]);
                        if (edits[row.studentId] === undefined || Number.isNaN(num)) return;
                        saveMutation.mutate({ studentId: row.studentId, score: num });
                      }}
                      className="h-9 w-20 rounded-md border border-line bg-transparent px-2 text-sm outline-none focus:border-ink dark:border-line-dark dark:focus:border-white"
                    />
                  </td>
                </tr>
              );
            })}
            {!isLoading && (grades ?? []).length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-sm text-ink-300">No students enrolled in this class.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink-300">Scores save automatically when you leave a field.</p>
    </div>
  );
}
