import { useQuery } from "@tanstack/react-query";
import { Sparkles, AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { governmentApi } from "@/lib/governmentApi";
import { ApiError } from "@/lib/apiClient";

export function DropoutAnalysis() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: regionStats, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["gov-statistics"],
    queryFn: () => governmentApi.statistics.list(accessToken!),
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Government to view dropout analysis</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load dropout data</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  const highRisk = [...(regionStats ?? [])].sort((a, b) => b.dropoutRate - a.dropoutRate).slice(0, 2);

  return (
    <div className="space-y-6">
      <PageHeader title="Dropout analysis" description="Highest-risk regions by dropout rate (reference data)" />

      <Card>
        <CardHeader>
          <CardTitle>High-risk regions</CardTitle>
          <Badge variant="gold">
            <Sparkles className="h-3 w-3" /> Flagged
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && <p className="text-sm text-ink-300">Loading…</p>}
          {highRisk.map((r) => (
            <div key={r.id} className="rounded-md border border-alert/30 bg-alert-light/40 p-3 text-sm">
              <p className="font-medium text-alert">{r.region} — {r.dropoutRate}% dropout rate</p>
              <p className="mt-1 text-xs text-alert/80">
                {r.schools} schools, {r.students.toLocaleString()} students in this region.
              </p>
            </div>
          ))}
          {!isLoading && highRisk.length === 0 && <p className="text-sm text-ink-300">No regional data available yet.</p>}
        </CardContent>
      </Card>
      <p className="text-center text-[11px] text-ink-300">
        This dropout data is seeded reference data, not a live AI model output — the platform doesn't yet track enrollment trends over time to compute this automatically.
      </p>
    </div>
  );
}
