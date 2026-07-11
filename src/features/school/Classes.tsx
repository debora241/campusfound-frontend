import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, MapPin, Plus, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { schoolClassesApi } from "@/lib/schoolClassesApi";
import { teachersApi } from "@/lib/teachersApi";
import { ApiError } from "@/lib/apiClient";

const schema = z.object({
  name: z.string().min(1, "Enter a class name"),
  room: z.string().optional(),
  teacherId: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function Classes() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: classes, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["school-classes"],
    queryFn: () => schoolClassesApi.list(accessToken!),
    enabled: !!accessToken,
  });

  const { data: teachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => teachersApi.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => schoolClassesApi.create(accessToken!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-classes"] });
      toast.success("Class created");
      reset();
      setOpen(false);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't create class"),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load classes</p>
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
        title="Classes & courses"
        description={isLoading ? "Loading…" : `${classes?.length ?? 0} active classes this term`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" /> New class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a class</DialogTitle>
                <DialogDescription>Creates a real class record for this school.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit((v) => createMutation.mutate(v))} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="name">Class name</Label>
                  <Input id="name" placeholder="e.g. Form 4B" error={errors.name?.message} {...register("name")} />
                </div>
                <div>
                  <Label htmlFor="room">Room (optional)</Label>
                  <Input id="room" {...register("room")} />
                </div>
                <div>
                  <Label htmlFor="teacherId">Class teacher (optional)</Label>
                  <select
                    id="teacherId"
                    className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-ink dark:border-line-dark dark:bg-transparent dark:focus:border-white"
                    {...register("teacherId")}
                    defaultValue=""
                  >
                    <option value="">No teacher assigned</option>
                    {(teachers ?? []).map((t) => (
                      <option key={t.id} value={t.id}>{t.fullName}</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting || createMutation.isPending}>
                  {createMutation.isPending ? "Creating…" : "Create class"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(classes ?? []).map((c) => (
          <Card key={c.id}>
            <CardContent>
              <p className="font-semibold">{c.name}</p>
              <p className="mt-0.5 text-sm text-ink-300">{c.teacherName ?? "No teacher assigned"}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-300">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> {c.studentCount} students
                </span>
                {c.room && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {c.room}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && (classes ?? []).length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-ink-300">No classes yet — create one to get started.</p>
        )}
      </div>
    </div>
  );
}
