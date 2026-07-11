import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
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
import { policeApi, type BackendIncident } from "@/lib/policeApi";
import { ApiError } from "@/lib/apiClient";

const severityVariant = { low: "neutral", medium: "gold", high: "alert" } as const;
const statusVariant = { open: "alert", investigating: "gold", closed: "verified" } as const;

export function IncidentReports() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [respondTarget, setRespondTarget] = useState<BackendIncident | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("low");
  const [unit, setUnit] = useState("");
  const [minutes, setMinutes] = useState("");
  const [outcome, setOutcome] = useState("");

  const { data: incidents, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["police-incidents"],
    queryFn: () => policeApi.incidents.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: () => policeApi.incidents.create(accessToken!, { title, location, severity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["police-incidents"] });
      toast.success("Incident report filed");
      setCreateOpen(false);
      setTitle("");
      setLocation("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't file report"),
  });

  const respondMutation = useMutation({
    mutationFn: () =>
      policeApi.incidents.respond(accessToken!, respondTarget!.id, { respondingUnit: unit, responseTimeMinutes: Number(minutes), outcome }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["police-incidents"] });
      queryClient.invalidateQueries({ queryKey: ["police-responses"] });
      toast.success("Response recorded, incident closed");
      setRespondTarget(null);
      setUnit("");
      setMinutes("");
      setOutcome("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't record response"),
  });

  const columns: ColumnDef<BackendIncident, any>[] = [
    { accessorKey: "title", header: "Incident" },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "reportedAt", header: "Reported", cell: ({ getValue }) => new Date(getValue() as string).toLocaleString() },
    { accessorKey: "severity", header: "Severity", cell: ({ getValue }) => <Badge variant={severityVariant[getValue() as BackendIncident["severity"]]}>{getValue() as string}</Badge> },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <Badge variant={statusVariant[getValue() as BackendIncident["status"]]}>{getValue() as string}</Badge> },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        row.original.status !== "closed" ? (
          <Button size="sm" variant="secondary" onClick={() => setRespondTarget(row.original)}>
            Respond
          </Button>
        ) : null,
    },
  ];

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Police to manage incident reports</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load incident reports</p>
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
        title="Incident reports"
        description={isLoading ? "Loading…" : `${incidents?.length ?? 0} reports on file`}
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" /> New report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>File an incident report</DialogTitle>
                <DialogDescription>Creates a real record.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Description</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <select
                    id="severity"
                    className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-ink dark:border-line-dark dark:bg-transparent dark:focus:border-white"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <Button className="w-full" disabled={!title || !location || createMutation.isPending} onClick={() => createMutation.mutate()}>
                  {createMutation.isPending ? "Filing…" : "File report"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable columns={columns} data={incidents ?? []} searchPlaceholder="Search incidents…" emptyLabel={isLoading ? "Loading…" : "No incidents on file."} />

      <Dialog open={!!respondTarget} onOpenChange={(o) => !o && setRespondTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record response</DialogTitle>
            <DialogDescription>{respondTarget?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="unit">Responding unit</Label>
              <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="minutes">Response time (minutes)</Label>
              <Input id="minutes" type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="outcome">Outcome</Label>
              <Input id="outcome" value={outcome} onChange={(e) => setOutcome(e.target.value)} />
            </div>
            <Button className="w-full" disabled={!unit || !minutes || !outcome || respondMutation.isPending} onClick={() => respondMutation.mutate()}>
              {respondMutation.isPending ? "Recording…" : "Record response & close incident"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
