import { useQuery } from "@tanstack/react-query";
import { Server, Database, Users, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { adminApi } from "@/lib/adminApi";
import { ApiError } from "@/lib/apiClient";

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function SystemMonitoring() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: stats, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-system"],
    queryFn: () => adminApi.system.stats(accessToken!),
    enabled: !!accessToken,
    refetchInterval: 15000,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Super Admin to view system monitoring</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load system stats</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="System monitoring" description="Live counts from the database and API process" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={isLoading ? "…" : String(stats?.totalUsers)} icon={Users} />
        <StatCard label="Institutions" value={isLoading ? "…" : String(stats?.totalInstitutions)} icon={Database} />
        <StatCard label="Verified credentials" value={isLoading ? "…" : String(stats?.verifiedCredentials)} icon={ShieldCheck} />
        <StatCard label="API process uptime" value={isLoading ? "…" : formatUptime(stats?.processUptimeSeconds ?? 0)} icon={Server} trend={stats?.nodeVersion} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About these numbers</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-ink-300">
          These figures are queried live from the database and the running Node process — not simulated. Request latency,
          error-rate, and traffic-volume charts aren't shown here because this API doesn't yet have request-level
          instrumentation (an APM layer) to measure them honestly; adding one is a natural next step rather than
          displaying invented numbers.
        </CardContent>
      </Card>
    </div>
  );
}
