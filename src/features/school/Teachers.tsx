import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { teachersApi, type BackendTeacher } from "@/lib/teachersApi";
import { ApiError } from "@/lib/apiClient";

const schema = z.object({
  fullName: z.string().min(2, "Enter the teacher's full name"),
  subject: z.string().min(1, "Enter a subject"),
  staffId: z.string().optional(),
  department: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const columns: ColumnDef<BackendTeacher, any>[] = [
  { accessorKey: "fullName", header: "Teacher" },
  { accessorKey: "staffId", header: "Staff ID", cell: ({ getValue }) => (getValue() as string) ?? "—" },
  { accessorKey: "subject", header: "Subject", cell: ({ getValue }) => (getValue() as string) ?? "—" },
  { accessorKey: "department", header: "Department", cell: ({ getValue }) => (getValue() as string) ?? "—" },
];

export function Teachers() {
  const [open, setOpen] = useState(false);
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();

  const {
    data: teachers,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => teachersApi.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: (payload: FormValues) => teachersApi.create(accessToken!, payload),
    onSuccess: (teacher) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success(`${teacher.fullName} added`);
      reset();
      setOpen(false);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Couldn't add teacher");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a School Administrator to manage teachers</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">
          This page is now connected to the real CampusFound backend and needs an authenticated session.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load teachers</p>
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
        title="Teachers"
        description={isLoading ? "Loading…" : `${teachers?.length ?? 0} teaching staff`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-3.5 w-3.5" /> Add teacher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a teacher</DialogTitle>
                <DialogDescription>This creates a real record in the school's staff roster.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit((values) => createMutation.mutate(values))} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" error={errors.fullName?.message} {...register("fullName")} />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="e.g. Mathematics" error={errors.subject?.message} {...register("subject")} />
                </div>
                <div>
                  <Label htmlFor="staffId">Staff ID (optional)</Label>
                  <Input id="staffId" {...register("staffId")} />
                </div>
                <div>
                  <Label htmlFor="department">Department (optional)</Label>
                  <Input id="department" {...register("department")} />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting || createMutation.isPending}>
                  {createMutation.isPending ? "Adding…" : "Add teacher"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable
        columns={columns}
        data={teachers ?? []}
        searchPlaceholder="Search teachers…"
        emptyLabel={isLoading ? "Loading teachers…" : "No teachers match your search."}
      />
    </div>
  );
}
