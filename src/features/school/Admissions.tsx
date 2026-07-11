import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, X, AlertTriangle, RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { schoolAdmissionsApi, type BackendAdmission } from "@/lib/schoolAdmissionsApi";
import { ApiError } from "@/lib/apiClient";

const stageVariant = {
  submitted: "neutral",
  review: "gold",
  interview: "gold",
  accepted: "verified",
  rejected: "alert",
} as const;

export function Admissions() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [gradeApplied, setGradeApplied] = useState("");

  const { data: admissions, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["school-admissions"],
    queryFn: () => schoolAdmissionsApi.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: () => schoolAdmissionsApi.create(accessToken!, { applicantName, gradeApplied }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-admissions"] });
      toast.success("Application recorded");
      setOpen(false);
      setApplicantName("");
      setGradeApplied("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't record application"),
  });

  const stageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) => schoolAdmissionsApi.updateStage(accessToken!, id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-admissions"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't update application"),
  });

  const columns: ColumnDef<BackendAdmission, any>[] = [
    { accessorKey: "applicantName", header: "Applicant" },
    { accessorKey: "gradeApplied", header: "Grade applied" },
    { accessorKey: "submittedOn", header: "Submitted", cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString() },
    {
      accessorKey: "stage",
      header: "Stage",
      cell: ({ getValue }) => <Badge variant={stageVariant[getValue() as BackendAdmission["stage"]]}>{getValue() as string}</Badge>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        ["submitted", "review", "interview"].includes(row.original.stage) ? (
          <div className="flex gap-1.5">
            <Button variant="secondary" size="icon" aria-label="Accept" onClick={() => stageMutation.mutate({ id: row.original.id, stage: "accepted" })}>
              <Check className="h-4 w-4 text-verified" />
            </Button>
            <Button variant="secondary" size="icon" aria-label="Reject" onClick={() => stageMutation.mutate({ id: row.original.id, stage: "rejected" })}>
              <X className="h-4 w-4 text-alert" />
            </Button>
          </div>
        ) : null,
    },
  ];

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a School Administrator to manage admissions</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load admissions</p>
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
        title="Admissions"
        description={isLoading ? "Loading…" : `${admissions?.length ?? 0} applications`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" /> New application
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record an application</DialogTitle>
                <DialogDescription>Creates a real admissions record.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="applicantName">Applicant name</Label>
                  <Input id="applicantName" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="gradeApplied">Grade applied</Label>
                  <Input id="gradeApplied" placeholder="e.g. Form 1" value={gradeApplied} onChange={(e) => setGradeApplied(e.target.value)} />
                </div>
                <Button className="w-full" disabled={!applicantName || !gradeApplied || createMutation.isPending} onClick={() => createMutation.mutate()}>
                  {createMutation.isPending ? "Recording…" : "Record application"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable columns={columns} data={admissions ?? []} searchPlaceholder="Search applicants…" emptyLabel={isLoading ? "Loading…" : "No applications yet."} />
    </div>
  );
}
