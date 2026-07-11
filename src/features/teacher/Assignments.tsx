import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { teacherApi, type TeacherAssignment } from "@/lib/teacherApi";
import { ApiError } from "@/lib/apiClient";

const statusVariant = { scheduled: "neutral", in_progress: "gold", graded: "verified" } as const;

const schema = z.object({
  name: z.string().min(3, "Enter a title"),
  classRoomId: z.string().min(1, "Select a class"),
  date: z.string().min(1, "Select a due date"),
});
type FormValues = z.infer<typeof schema>;

export function Assignments() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: classes } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: () => teacherApi.getClasses(accessToken!),
    enabled: !!accessToken,
  });

  const { data: assignments, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["teacher-assignments"],
    queryFn: () => teacherApi.getAssignments(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => teacherApi.createAssignment(accessToken!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-dashboard"] });
      toast.success("Assignment created");
      reset();
      setOpen(false);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't create assignment"),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const columns: ColumnDef<TeacherAssignment, any>[] = [
    { accessorKey: "title", header: "Assignment" },
    { accessorKey: "className", header: "Class", cell: ({ getValue }) => (getValue() as string) ?? "—" },
    { accessorKey: "dueDate", header: "Due date", cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString() },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <Badge variant={statusVariant[getValue() as TeacherAssignment["status"]]}>{(getValue() as string).replace("_", " ")}</Badge>,
    },
  ];

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load assignments</p>
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
        title="Assignments"
        description={isLoading ? "Loading…" : `${assignments?.length ?? 0} assignments across your classes`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" /> New assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create assignment</DialogTitle>
                <DialogDescription>Creates a real assessment for the selected class.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit((v) => createMutation.mutate(v))} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="name">Title</Label>
                  <Input id="name" error={errors.name?.message} {...register("name")} />
                </div>
                <div>
                  <Label htmlFor="classRoomId">Class</Label>
                  <select
                    id="classRoomId"
                    className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-ink dark:border-line-dark dark:bg-transparent dark:focus:border-white"
                    {...register("classRoomId")}
                    defaultValue=""
                  >
                    <option value="" disabled>Select a class</option>
                    {(classes ?? []).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.classRoomId && <p className="mt-1.5 text-xs text-alert">{errors.classRoomId.message}</p>}
                </div>
                <div>
                  <Label htmlFor="date">Due date</Label>
                  <Input id="date" type="date" error={errors.date?.message} {...register("date")} />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting || createMutation.isPending}>
                  {createMutation.isPending ? "Creating…" : "Create assignment"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable
        columns={columns}
        data={assignments ?? []}
        searchPlaceholder="Search assignments…"
        emptyLabel={isLoading ? "Loading…" : "No assignments yet."}
      />
    </div>
  );
}
