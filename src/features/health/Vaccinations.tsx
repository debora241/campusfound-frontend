import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Syringe, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { healthApi } from "@/lib/healthApi";
import { institutionsApi } from "@/lib/institutionsApi";
import { ApiError } from "@/lib/apiClient";

export function Vaccinations() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [schoolQuery, setSchoolQuery] = useState("");
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");

  const { data: campaigns, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["health-vaccinations"],
    queryFn: () => healthApi.vaccinations.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const matches = await institutionsApi.search(schoolQuery);
      const school = matches.find((m) => m.type === "School");
      if (!school) throw new ApiError("No matching school found — try the exact school code", 404);
      return healthApi.vaccinations.create(accessToken!, { schoolId: school.id, name, dueDate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-vaccinations"] });
      toast.success("Campaign created");
      setOpen(false);
      setSchoolQuery("");
      setName("");
      setDueDate("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't create campaign"),
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a Health Partner to manage vaccinations</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load vaccination campaigns</p>
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
        title="Vaccinations"
        description={isLoading ? "Loading…" : `${campaigns?.length ?? 0} campaigns across partner schools`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Syringe className="h-3.5 w-3.5" /> New campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a vaccination campaign</DialogTitle>
                <DialogDescription>Enter the exact school code (e.g. LBD-001).</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="school">School code</Label>
                  <Input id="school" value={schoolQuery} onChange={(e) => setSchoolQuery(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="name">Campaign name</Label>
                  <Input id="name" placeholder="e.g. Measles booster" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due date</Label>
                  <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <Button className="w-full" disabled={!schoolQuery || !name || !dueDate || createMutation.isPending} onClick={() => createMutation.mutate()}>
                  {createMutation.isPending ? "Creating…" : "Create campaign"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="space-y-3">
        {(campaigns ?? []).map((c) => (
          <Card key={c.id}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-ink-300">{c.school.name} · Due {new Date(c.dueDate).toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-semibold">{c.coverage}%</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-50 dark:bg-white/10">
                <div className={`h-full ${c.coverage >= 80 ? "bg-verified" : c.coverage >= 50 ? "bg-gold" : "bg-alert"}`} style={{ width: `${c.coverage}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && (campaigns ?? []).length === 0 && <p className="py-10 text-center text-sm text-ink-300">No vaccination campaigns yet.</p>}
      </div>
    </div>
  );
}
