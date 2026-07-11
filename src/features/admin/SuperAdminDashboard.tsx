import { useQuery } from "@tanstack/react-query";
import { Server, Users, School, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { adminApi } from "@/lib/adminApi";

export function SuperAdminDashboard() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const enabled = !!accessToken;

  const { data: stats } = useQuery({ queryKey: ["admin-system"], queryFn: () => adminApi.system.stats(accessToken!), enabled });
  const { data: logs } = useQuery({ queryKey: ["admin-audit-logs"], queryFn: () => adminApi.auditLogs.list(accessToken!), enabled });

  return (
    <div className="space-y-6">
      <PageHeader title="System overview" description="Platform-wide administration — all institutions" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Managed institutions" value={stats ? String(stats.totalInstitutions) : "—"} icon={School} />
        <StatCard label="Total platform users" value={stats ? stats.totalUsers.toLocaleString() : "—"} icon={Users} />
        <StatCard label="API process uptime" value={stats ? `${Math.floor(stats.processUptimeSeconds / 60)}m` : "—"} icon={Server} />
        <StatCard label="Verified credentials issued" value={stats ? stats.verifiedCredentials.toLocaleString() : "—"} icon={ShieldCheck} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent audit activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(logs ?? []).slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center justify-between rounded-md border border-line p-3 text-sm dark:border-line-dark">
              <div>
                <p className="font-medium">{log.action}</p>
                <p className="text-xs text-ink-300">{log.actor} → {log.target}</p>
              </div>
              <span className="text-xs text-ink-300">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
          {(logs ?? []).length === 0 && <p className="text-sm text-ink-300">No audit activity yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
