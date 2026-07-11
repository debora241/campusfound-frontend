import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarPlus, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { universityApi, type UniBackendExam } from "@/lib/universityApi";
import { ApiError } from "@/lib/apiClient";

const statusVariant = { scheduled: "neutral", in_progress: "gold", graded: "verified" } as const;

export function UniversityExaminations() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [date, setDate] = useState("");

  const { data: exams, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["university-exams"],
    queryFn: () => universityApi.exams.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: () => universityApi.exams.create(accessToken!, { name, className: program, date }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university-exams"] });
      toast.success("Examination scheduled");
      setOpen(false);
      setName("");
      setProgram("");
      setDate("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't schedule examination"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => universityApi.exams.updateStatus(accessToken!, id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["university-exams"] }),
  });

  const columns: ColumnDef<UniBackendExam, any>[] = [
    { accessorKey: "name", header: "Examination" },
    { accessorKey: "className", header: "Program", cell: ({ getValue }) => (getValue() as string) ?? "—" },
    { accessorKey: "date", header: "Date", cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString() },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <Badge variant={statusVariant[getValue() as UniBackendExam["status"]]}>{(getValue() as string).replace("_", " ")}</Badge>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        row.original.status !== "graded" ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => statusMutation.mutate({ id: row.original.id, status: row.original.status === "scheduled" ? "in_progress" : "graded" })}
          >
            {row.original.status === "scheduled" ? "Start" : "Mark graded"}
          </Button>
        ) : null,
    },
  ];

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a University Administrator to manage examinations</p>
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
        description={isLoading ? "Loading…" : `${exams?.length ?? 0} examinations scheduled`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
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
                  <Label htmlFor="program">Program</Label>
                  <Input id="program" placeholder="e.g. B.Sc. Computer Science" value={program} onChange={(e) => setProgram(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <Button className="w-full" disabled={!name || !program || !date || createMutation.isPending} onClick={() => createMutation.mutate()}>
                  {createMutation.isPending ? "Scheduling…" : "Schedule exam"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable columns={columns} data={exams ?? []} searchPlaceholder="Search examinations…" emptyLabel={isLoading ? "Loading…" : "No examinations scheduled yet."} />
    </div>
  );
}
