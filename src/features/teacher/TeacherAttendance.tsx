import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { teacherApi } from "@/lib/teacherApi";
import { ApiError } from "@/lib/apiClient";

type Status = "present" | "absent" | "late";

const STATUS_STYLES: Record<Status, string> = {
  present: "bg-verified text-white",
  absent: "bg-alert text-white",
  late: "bg-gold text-ink",
};

const today = new Date().toISOString().slice(0, 10);

export function TeacherAttendance() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [classId, setClassId] = useState<string | null>(null);
  const [marks, setMarks] = useState<Record<string, Status>>({});

  const { data: classes } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: () => teacherApi.getClasses(accessToken!),
    enabled: !!accessToken,
  });

  const activeClassId = classId ?? classes?.[0]?.id ?? null;

  const { data: attendance, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["teacher-attendance", activeClassId],
    queryFn: () => teacherApi.getAttendance(accessToken!, activeClassId!, today),
    enabled: !!accessToken && !!activeClassId,
  });

  const effectiveMarks: Record<string, Status> = {
    ...Object.fromEntries((attendance?.students ?? []).map((s) => [s.studentId, s.status ?? "present"])),
    ...marks,
  };

  const saveMutation = useMutation({
    mutationFn: () =>
      teacherApi.markAttendance(accessToken!, {
        classRoomId: activeClassId!,
        date: today,
        entries: (attendance?.students ?? []).map((s) => ({ studentId: s.studentId, status: effectiveMarks[s.studentId] ?? "present" })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-attendance"] });
      toast.success("Attendance saved");
      setMarks({});
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't save attendance"),
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load attendance</p>
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
        title="Attendance"
        description="Mark today's attendance for your class"
        actions={
          <Button size="sm" disabled={!activeClassId || saveMutation.isPending} onClick={() => saveMutation.mutate()}>
            {saveMutation.isPending ? "Saving…" : "Save attendance"}
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(classes ?? []).map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setClassId(c.id);
              setMarks({});
            }}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeClassId === c.id
                ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink"
                : "border-line text-ink-500 dark:border-line-dark dark:text-ink-300"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-line dark:border-line-dark">
        {isLoading && <p className="p-6 text-center text-sm text-ink-300">Loading…</p>}
        {(attendance?.students ?? []).map((s, i) => (
          <div
            key={s.studentId}
            className={cn(
              "flex items-center justify-between px-4 py-3 text-sm",
              i !== 0 && "border-t border-line dark:border-line-dark"
            )}
          >
            <p className="font-medium">{s.studentName}</p>
            <div className="flex gap-1.5">
              {(["present", "late", "absent"] as Status[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setMarks((m) => ({ ...m, [s.studentId]: status }))}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
                    effectiveMarks[s.studentId] === status ? STATUS_STYLES[status] : "bg-ink-50 text-ink-500 dark:bg-white/5 dark:text-ink-300"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
        {!isLoading && (attendance?.students ?? []).length === 0 && (
          <p className="p-6 text-center text-sm text-ink-300">No students enrolled in this class yet.</p>
        )}
      </div>
    </div>
  );
}
