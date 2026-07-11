import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ASSIGNMENTS, TEACHER_CLASSES, type Assignment } from "./data";

const statusVariant = { open: "neutral", grading: "gold", closed: "verified" } as const;

const schema = z.object({
  title: z.string().min(3, "Enter a title"),
  classId: z.string().min(1, "Select a class"),
  dueDate: z.string().min(1, "Select a due date"),
});
type FormValues = z.infer<typeof schema>;

export function Assignments() {
  const [rows, setRows] = useState(ASSIGNMENTS);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const columns: ColumnDef<Assignment, any>[] = [
    { accessorKey: "title", header: "Assignment" },
    {
      accessorKey: "classId",
      header: "Class",
      cell: ({ getValue }) => TEACHER_CLASSES.find((c) => c.id === getValue())?.name ?? getValue(),
    },
    { accessorKey: "dueDate", header: "Due date" },
    {
      id: "submissions",
      header: "Submissions",
      cell: ({ row }) => `${row.original.submissions}/${row.original.totalStudents}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <Badge variant={statusVariant[getValue() as Assignment["status"]]}>{getValue() as string}</Badge>,
    },
  ];

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    const cls = TEACHER_CLASSES.find((c) => c.id === values.classId);
    setRows((prev) => [
      { id: `ASG-${prev.length + 1}`, submissions: 0, totalStudents: cls?.studentCount ?? 0, status: "open", ...values },
      ...prev,
    ]);
    toast.success("Assignment created");
    reset();
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Assignments"
        description={`${rows.length} assignments across your classes`}
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
                <DialogDescription>Publish to the selected class immediately.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" error={errors.title?.message} {...register("title")} />
                </div>
                <div>
                  <Label htmlFor="classId">Class</Label>
                  <select
                    id="classId"
                    className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-ink dark:border-line-dark dark:bg-transparent dark:focus:border-white"
                    {...register("classId")}
                    defaultValue=""
                  >
                    <option value="" disabled>Select a class</option>
                    {TEACHER_CLASSES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.classId && <p className="mt-1.5 text-xs text-alert">{errors.classId.message}</p>}
                </div>
                <div>
                  <Label htmlFor="dueDate">Due date</Label>
                  <Input id="dueDate" type="date" error={errors.dueDate?.message} {...register("dueDate")} />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating…" : "Create assignment"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable columns={columns} data={rows} searchPlaceholder="Search assignments…" />
    </div>
  );
}
