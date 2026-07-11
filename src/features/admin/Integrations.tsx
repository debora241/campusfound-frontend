import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Copy, Trash2, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { adminApi } from "@/lib/adminApi";
import { ApiError } from "@/lib/apiClient";

export function Integrations() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);

  const { data: keys, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-api-keys"],
    queryFn: () => adminApi.apiKeys.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: () => adminApi.apiKeys.create(accessToken!, label),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["admin-api-keys"] });
      setNewKey(created.plainKey ?? null);
      setLabel("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't generate key"),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => adminApi.apiKeys.revoke(accessToken!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-api-keys"] });
      toast.success("API key revoked");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't revoke key"),
  });

  const closeDialog = () => {
    setOpen(false);
    setNewKey(null);
  };

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Super Admin to manage API keys</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load API keys</p>
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
        title="Integrations & API keys"
        description={isLoading ? "Loading…" : `${keys?.length ?? 0} active keys`}
        actions={
          <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : closeDialog())}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" /> Generate key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{newKey ? "Save this key now" : "Generate API key"}</DialogTitle>
                <DialogDescription>
                  {newKey ? "This is the only time the full key will be shown." : "Keys grant programmatic access — store them securely."}
                </DialogDescription>
              </DialogHeader>
              {newKey ? (
                <div className="space-y-4">
                  <div className="rounded-md bg-ink-50 p-3 font-mono text-xs break-all dark:bg-white/5">{newKey}</div>
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(newKey);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy key
                  </Button>
                  <Button className="w-full" onClick={closeDialog}>
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="label">Label</Label>
                    <Input id="label" placeholder="e.g. Reporting integration" value={label} onChange={(e) => setLabel(e.target.value)} />
                  </div>
                  <Button className="w-full" disabled={!label || createMutation.isPending} onClick={() => createMutation.mutate()}>
                    {createMutation.isPending ? "Generating…" : "Generate key"}
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        }
      />
      <div className="space-y-3">
        {(keys ?? []).map((k) => (
          <Card key={k.id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{k.label}</p>
                <p className="text-xs text-ink-300">
                  Created {new Date(k.createdAt).toLocaleDateString()} · Last used {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "Never"}
                </p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Revoke key" onClick={() => revokeMutation.mutate(k.id)}>
                <Trash2 className="h-4 w-4 text-alert" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {!isLoading && (keys ?? []).length === 0 && <p className="py-10 text-center text-sm text-ink-300">No active API keys.</p>}
      </div>
    </div>
  );
}
