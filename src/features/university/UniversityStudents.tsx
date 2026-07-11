import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Download, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { universityApi, type UniBackendStudent } from "@/lib/universityApi";
import { ApiError } from "@/lib/apiClient";

const statusVariant = { active: "verified", on_leave: "gold", suspended: "alert", graduated: "neutral" } as const;

const schema = z.object({
  fullName: z.string().min(2, "Enter the student's full name"),
  program: z.string().min(1, "Enter a program"),
  registrationNumber: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const columns: ColumnDef<UniBackendStudent, any>[] = [
  { accessorKey: "fullName", header: "Student" },
  { accessorKey: "registrationNumber", header: "Reg. number", cell: ({ getValue }) => (getValue() as string) ?? "—" },
  { accessorKey: "program", header: "Program", cell: ({ getValue }) => (getValue() as string) ?? "—" },
  { accessorKey: "year", header: "Year", cell: ({ getValue }) => (getValue() ? `Year ${getValue()}` : "—") },
  { accessorKey: "gpa", header: "GPA", cell: ({ getValue }) => (getValue() ? (getValue() as number).toFixed(1) : "—") },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <Badge variant={statusVariant[getValue() as UniBackendStudent["status"]]}>{(getValue() as string).replace("_", " ")}</Badge>,
  },
];

export function UniversityStudents() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: students, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["university-students"],
    queryFn: () => universityApi.students.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => universityApi.students.create(accessToken!, values),
    onSuccess: (student) => {
      queryClient.invalidateQueries({ queryKey: ["university-students"] });
      toast.success(`${student.fullName} enrolled`);
      reset();
      setOpen(false);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't enroll student"),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a University Administrator to manage students</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load students</p>
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
        title="Students"
        description={isLoading ? "Loading…" : `${students?.length ?? 0} students across all programs`}
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-3.5 w-3.5" /> Enroll student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enroll a new student</DialogTitle>
                  <DialogDescription>Creates a real record in the university's roster.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit((values) => createMutation.mutate(values))} className="space-y-4" noValidate>
                  <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" error={errors.fullName?.message} {...register("fullName")} />
                  </div>
                  <div>
                    <Label htmlFor="program">Program</Label>
                    <Input id="program" placeholder="e.g. B.Sc. Computer Science" error={errors.program?.message} {...register("program")} />
                  </div>
                  <div>
                    <Label htmlFor="registrationNumber">Registration number (optional)</Label>
                    <Input id="registrationNumber" {...register("registrationNumber")} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting || createMutation.isPending}>
                    {createMutation.isPending ? "Enrolling…" : "Enroll student"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />
      <DataTable columns={columns} data={students ?? []} searchPlaceholder="Search students by name or registration number…" emptyLabel={isLoading ? "Loading…" : "No students match your search."} />
    </div>
  );
}
