import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { governmentApi } from "@/lib/governmentApi";
import { ApiError } from "@/lib/apiClient";

export function Statistics() {
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
        <p className="font-medium">Sign in as Government to view statistics</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load statistics</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Statistics & heatmaps" description="Cross-regional education indicators (reference data)" />

      <Card>
        <CardHeader>
          <CardTitle>Schools per region</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {isLoading || (regionStats ?? []).length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-ink-300">{isLoading ? "Loading…" : "No data available."}</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E1DC" vertical={false} />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip />
                <Bar dataKey="schools" fill="#C89B3C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dropout rate heatmap by region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(regionStats ?? []).map((r) => {
              const intensity = Math.min(r.dropoutRate / 15, 1);
              return (
                <div key={r.id} className="rounded-md p-4 text-center" style={{ backgroundColor: `rgba(179,67,43,${0.08 + intensity * 0.35})` }}>
                  <p className="text-xs font-medium text-ink-500 dark:text-ink-300">{r.region}</p>
                  <p className="mt-1 text-xl font-semibold text-alert">{r.dropoutRate}%</p>
                  <p className="mt-1 text-[11px] text-ink-300">{r.schools} schools</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
