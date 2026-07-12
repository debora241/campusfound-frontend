import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bus, Home, Plus, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { schoolTransportApi } from "@/lib/schoolTransportApi";
import { ApiError } from "@/lib/apiClient";

const schema = z.object({
  name: z.string().min(1, "Enter a route name"),
  driverName: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function Transport() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: routes, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["school-transport"],
    queryFn: () => schoolTransportApi.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => schoolTransportApi.create(accessToken!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-transport"] });
      toast.success("Route added");
      reset();
      setOpen(false);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't add route"),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load transport routes</p>
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
    <div className="space-y-6">
      <PageHeader
        title="Transport & hostels"
        description="Bus routes and boarding overview"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" /> New route
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a bus route</DialogTitle>
                <DialogDescription>Creates a real route for this school.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit((v) => createMutation.mutate(v))} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="name">Route name</Label>
                  <Input id="name" placeholder="e.g. Bonaberi — Campus" error={errors.name?.message} {...register("name")} />
                </div>
                <div>
                  <Label htmlFor="driverName">Driver (optional)</Label>
                  <Input id="driverName" {...register("driverName")} />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting || createMutation.isPending}>
                  {createMutation.isPending ? "Adding…" : "Add route"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink-500 dark:text-ink-300">
          <Bus className="h-4 w-4" /> Bus routes
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {isLoading && <p className="text-sm text-ink-300">Loading…</p>}
          {(routes ?? []).map((r) => (
            <Card key={r.id}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-ink-300">
                    {r.driverName ? `Driver: ${r.driverName} · ` : ""}
                    {r.studentCount} students
                  </p>
                </div>
                <Badge variant={r.status === "on_time" ? "verified" : "alert"}>{r.status.replace("_", " ")}</Badge>
              </CardContent>
            </Card>
          ))}
          {!isLoading && (routes ?? []).length === 0 && (
            <p className="col-span-full py-6 text-center text-sm text-ink-300">No bus routes yet — add one to get started.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink-500 dark:text-ink-300">
          <Home className="h-4 w-4" /> Hostels
        </h2>
        <Card>
          <CardContent className="flex flex-col items-center py-10 text-center text-sm text-ink-300">
            <Home className="mb-2 h-6 w-6" />
            This school doesn't operate boarding hostels this term.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
