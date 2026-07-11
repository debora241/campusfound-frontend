import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { universityApi } from "@/lib/universityApi";
import { ApiError } from "@/lib/apiClient";

export function Programs() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [durationYears, setDurationYears] = useState("4");

  const { data: programs, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["university-programs"],
    queryFn: () => universityApi.programs.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: () => universityApi.programs.create(accessToken!, { name, faculty, durationYears: Number(durationYears) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university-programs"] });
      toast.success("Program created");
      setOpen(false);
      setName("");
      setFaculty("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't create program"),
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a University Administrator to manage programs</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load programs</p>
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
        title="Programs & courses"
        description={isLoading ? "Loading…" : `${programs?.length ?? 0} degree programs offered`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">New program</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a program</DialogTitle>
                <DialogDescription>Adds a real degree program.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Program name</Label>
                  <Input id="name" placeholder="e.g. LL.B. Law" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="faculty">Faculty</Label>
                  <Input id="faculty" placeholder="e.g. Faculty of Law" value={faculty} onChange={(e) => setFaculty(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="durationYears">Duration (years)</Label>
                  <Input id="durationYears" type="number" min={1} max={10} value={durationYears} onChange={(e) => setDurationYears(e.target.value)} />
                </div>
                <Button className="w-full" disabled={!name || !faculty || createMutation.isPending} onClick={() => createMutation.mutate()}>
                  {createMutation.isPending ? "Creating…" : "Create program"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(programs ?? []).map((p) => (
          <Card key={p.id}>
            <CardContent>
              <p className="font-semibold">{p.name}</p>
              <p className="mt-0.5 text-sm text-ink-300">{p.faculty}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-300">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> {p.enrolled} enrolled
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {p.durationYears} years
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && (programs ?? []).length === 0 && <p className="col-span-full py-10 text-center text-sm text-ink-300">No programs created yet.</p>}
      </div>
    </div>
  );
}
