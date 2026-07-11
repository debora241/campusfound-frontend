import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarPlus, AlertTriangle, RefreshCw, ClipboardEdit } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { schoolExamsApi, type BackendExam } from "@/lib/schoolExamsApi";
import { studentsApi } from "@/lib/studentsApi";
import { ApiError } from "@/lib/apiClient";

const statusVariant = { scheduled: "neutral", in_progress: "gold", graded: "verified" } as const;

export function Examinations() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [gradingExam, setGradingExam] = useState<BackendExam | null>(null);
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [date, setDate] = useState("");

  const { data: exams, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["school-exams"],
    queryFn: () => schoolExamsApi.list(accessToken!),
    enabled: !!accessToken,
  });

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentsApi.list(accessToken!),
    enabled: !!accessToken,
  });

  const { data: grades } = useQuery({
    queryKey: ["exam-grades", gradingExam?.id],
    queryFn: () => schoolExamsApi.listGrades(accessToken!, gradingExam!.id),
    enabled: !!accessToken && !!gradingExam,
  });

  const createMutation = useMutation({
    mutationFn: () => schoolExamsApi.create(accessToken!, { name, className, date }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-exams"] });
      toast.success("Exam scheduled");
      setCreateOpen(false);
      setName("");
      setClassName("");
      setDate("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't schedule exam"),
  });

  const gradeMutation = useMutation({
    mutationFn: (payload: { studentId: string; score: number }) =>
      schoolExamsApi.setGrade(accessToken!, gradingExam!.id, { studentId: payload.studentId, score: payload.score, maxScore: 100 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-grades", gradingExam?.id] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't save grade"),
  });

  const markGraded = useMutation({
    mutationFn: () => schoolExamsApi.updateStatus(accessToken!, gradingExam!.id, "graded"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-exams"] });
      toast.success("Exam marked as graded");
      setGradingExam(null);
    },
  });

  const columns: ColumnDef<BackendExam, any>[] = [
    { accessorKey: "name", header: "Examination" },
    { accessorKey: "className", header: "Class", cell: ({ getValue }) => (getValue() as string) ?? "—" },
    { accessorKey: "date", header: "Date", cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString() },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <Badge variant={statusVariant[getValue() as BackendExam["status"]]}>{(getValue() as string).replace("_", " ")}</Badge>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button size="sm" variant="secondary" onClick={() => setGradingExam(row.original)}>
          <ClipboardEdit className="h-3.5 w-3.5" /> Grades
        </Button>
      ),
    },
  ];

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a School Administrator to manage examinations</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load examinations</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Examinations"
        description={isLoading ? "Loading…" : `${exams?.length ?? 0} examinations`}
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <CalendarPlus className="h-3.5 w-3.5" /> Schedule exam
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule an examination</DialogTitle>
                <DialogDescription>Creates a real exam record.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Examination name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="className">Class</Label>
                  <Input id="className" placeholder="e.g. Form 5A" value={className} onChange={(e) => setClassName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <Button className="w-full" disabled={!name || !className || !date || createMutation.isPending} onClick={() => createMutation.mutate()}>
                  {createMutation.isPending ? "Scheduling…" : "Schedule exam"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable columns={columns} data={exams ?? []} searchPlaceholder="Search examinations…" emptyLabel={isLoading ? "Loading…" : "No examinations yet."} />

      <Dialog open={!!gradingExam} onOpenChange={(o) => !o && setGradingExam(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{gradingExam?.name}</DialogTitle>
            <DialogDescription>Enter each student's score out of 100. Saved automatically.</DialogDescription>
          </DialogHeader>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {(students ?? []).map((s) => {
              const existing = grades?.find((g) => g.studentId === s.id);
              return (
                <div key={s.id} className="flex items-center justify-between gap-3 rounded-md border border-line p-2 dark:border-line-dark">
                  <span className="text-sm">{s.fullName}</span>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    className="w-24"
                    defaultValue={existing?.score ?? ""}
                    placeholder="—"
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value === "") return;
                      gradeMutation.mutate({ studentId: s.id, score: Number(value) });
                    }}
                  />
                </div>
              );
            })}
          </div>
          <Button className="mt-4 w-full" onClick={() => markGraded.mutate()} disabled={markGraded.isPending}>
            {markGraded.isPending ? "Saving…" : "Mark exam as graded"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
