import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pin, Megaphone, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { schoolAnnouncementsApi } from "@/lib/schoolAnnouncementsApi";
import { ApiError } from "@/lib/apiClient";

export function Announcements() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("");
  const [pinned, setPinned] = useState(false);

  const { data: announcements, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["school-announcements"],
    queryFn: () => schoolAnnouncementsApi.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: () => schoolAnnouncementsApi.create(accessToken!, { title, audience, pinned }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-announcements"] });
      toast.success("Announcement published");
      setOpen(false);
      setTitle("");
      setAudience("");
      setPinned(false);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't publish announcement"),
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a School Administrator to publish announcements</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load announcements</p>
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
        title="Announcements & events"
        description={isLoading ? "Loading…" : `${announcements?.length ?? 0} published`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Megaphone className="h-3.5 w-3.5" /> New announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Publish an announcement</DialogTitle>
                <DialogDescription>Visible to the selected audience immediately.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="audience">Audience</Label>
                  <Input id="audience" placeholder="e.g. All students & parents" value={audience} onChange={(e) => setAudience(e.target.value)} />
                </div>
                <label className="flex items-center gap-2 text-sm text-ink-300">
                  <input type="checkbox" className="h-3.5 w-3.5" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
                  Pin to top
                </label>
                <Button className="w-full" disabled={!title || !audience || createMutation.isPending} onClick={() => createMutation.mutate()}>
                  {createMutation.isPending ? "Publishing…" : "Publish"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="space-y-3">
        {(announcements ?? []).map((a) => (
          <Card key={a.id}>
            <CardContent className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {a.pinned && <Pin className="h-3.5 w-3.5 text-gold" />}
                  <p className="font-medium">{a.title}</p>
                </div>
                <p className="mt-1 text-xs text-ink-300">
                  {a.audience} · {new Date(a.publishedOn).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && (announcements ?? []).length === 0 && <p className="py-10 text-center text-sm text-ink-300">No announcements published yet.</p>}
      </div>
    </div>
  );
}
