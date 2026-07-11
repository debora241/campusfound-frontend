import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { schoolDisciplineApi, type BackendDisciplineCase } from "@/lib/schoolDisciplineApi";
import { studentsApi } from "@/lib/studentsApi";
import { ApiError } from "@/lib/apiClient";

const severityVariant = { minor: "neutral", moderate: "gold", severe: "alert" } as const;

export function Discipline() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [incident, setIncident] = useState("");
  const [severity, setSeverity] = useState("minor");

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentsApi.list(accessToken!),
    enabled: !!accessToken,
  });

  const { data: cases, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["school-discipline"],
    queryFn: () => schoolDisciplineApi.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: () => schoolDisciplineApi.create(accessToken!, { studentId, incident, severity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-discipline"] });
      toast.success("Case logged");
      setOpen(false);
      setStudentId("");
      setIncident("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't log case"),
  });

  const resolveMutation = useMutation({
    mutationFn: (id: string) => schoolDisciplineApi.resolve(accessToken!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-discipline"] });
      toast.success("Case marked resolved");
    },
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a School Administrator to manage discipline cases</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load discipline cases</p>
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
        title="Discipline & voting"
        description={isLoading ? "Loading…" : `${cases?.length ?? 0} cases on file`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" /> Log case
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log a discipline case</DialogTitle>
                <DialogDescription>Creates a real record for this student.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="student">Student</Label>
                  <select
                    id="student"
                    className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-ink dark:border-line-dark dark:bg-transparent dark:focus:border-white"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  >
                    <option value="" disabled>Select a student</option>
                    {(students ?? []).map((s) => (
                      <option key={s.id} value={s.id}>{s.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="incident">Incident description</Label>
                  <Input id="incident" value={incident} onChange={(e) => setIncident(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <select
                    id="severity"
                    className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-ink dark:border-line-dark dark:bg-transparent dark:focus:border-white"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <Button className="w-full" disabled={!studentId || !incident || createMutation.isPending} onClick={() => createMutation.mutate()}>
                  {createMutation.isPending ? "Logging…" : "Log case"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="space-y-3">
        {(cases ?? []).map((c: BackendDisciplineCase) => (
          <Card key={c.id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{c.student.fullName}</p>
                  <Badge variant={severityVariant[c.severity]}>{c.severity}</Badge>
                  {c.status === "resolved" && <Badge variant="verified">resolved</Badge>}
                </div>
                <p className="mt-1 text-sm text-ink-300">{c.incident}</p>
                <p className="mt-1 text-xs text-ink-300">Reported {new Date(c.reportedOn).toLocaleDateString()}</p>
              </div>
              {c.status === "open" && (
                <Button variant="secondary" size="sm" onClick={() => resolveMutation.mutate(c.id)}>
                  Mark resolved
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {!isLoading && (cases ?? []).length === 0 && <p className="py-10 text-center text-sm text-ink-300">No discipline cases on file.</p>}
      </div>
    </div>
  );
}
