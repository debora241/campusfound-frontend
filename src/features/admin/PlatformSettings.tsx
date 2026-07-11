import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { adminApi } from "@/lib/adminApi";
import { ApiError } from "@/lib/apiClient";

const TOGGLES = [
  { key: "maintenance", label: "Maintenance mode", description: "Temporarily disable access for non-admin users" },
  { key: "signups", label: "Allow new institution signups", description: "New schools and universities can self-register" },
  { key: "blockchain", label: "Blockchain anchoring", description: "Anchor new certificates and diplomas on-chain" },
];

export function PlatformSettings() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();

  const { data: settings, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => adminApi.settings.get(accessToken!),
    enabled: !!accessToken,
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: boolean }) => adminApi.settings.update(accessToken!, key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("Setting updated");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't update setting"),
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Super Admin to manage platform settings</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load settings</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Settings" description="Platform-wide configuration — changes take effect immediately" />
      <Card className="max-w-xl">
        <CardContent className="space-y-5">
          {isLoading && <p className="text-sm text-ink-300">Loading…</p>}
          {!isLoading &&
            TOGGLES.map((t) => {
              const value = settings?.[t.key] ?? false;
              return (
                <div key={t.key} className="flex items-center justify-between gap-4">
                  <div>
                    <Label className="mb-0">{t.label}</Label>
                    <p className="text-xs text-ink-300">{t.description}</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={value}
                    onClick={() => updateMutation.mutate({ key: t.key, value: !value })}
                    className={`h-6 w-11 shrink-0 rounded-full transition-colors ${value ? "bg-verified" : "bg-ink-50 dark:bg-white/10"}`}
                  >
                    <span className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              );
            })}
        </CardContent>
      </Card>
    </div>
  );
}
