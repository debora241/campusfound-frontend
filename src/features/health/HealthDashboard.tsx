import { useQuery } from "@tanstack/react-query";
import { HeartPulse, Syringe, Video, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hooks";
import { healthApi } from "@/lib/healthApi";

export function HealthDashboard() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const enabled = !!accessToken;

  const { data: requests } = useQuery({ queryKey: ["health-telemedicine"], queryFn: () => healthApi.telemedicine.list(accessToken!), enabled });
  const { data: sos } = useQuery({ queryKey: ["health-sos"], queryFn: () => healthApi.sos.list(accessToken!), enabled });
  const { data: campaigns } = useQuery({ queryKey: ["health-vaccinations"], queryFn: () => healthApi.vaccinations.list(accessToken!), enabled });

  const pendingCalls = (requests ?? []).filter((r) => r.status === "pending").length;
  const activeSos = (sos ?? []).filter((s) => s.status !== "resolved");
  const avgCoverage = (campaigns ?? []).length > 0 ? Math.round((campaigns ?? []).reduce((s, c) => s + c.coverage, 0) / campaigns!.length) : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Health partner dashboard" description="Cross-school medical oversight" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending consultations" value={String(pendingCalls)} icon={Video} />
        <StatCard label="Active health SOS" value={String(activeSos.length)} icon={ShieldAlert} trend={activeSos.length > 0 ? "Needs response" : "All clear"} trendUp={activeSos.length === 0} />
        <StatCard label="Avg. vaccination coverage" value={avgCoverage != null ? `${avgCoverage}%` : "—"} icon={Syringe} />
        <StatCard label="Campaigns tracked" value={String(campaigns?.length ?? 0)} icon={HeartPulse} />
      </div>

      <Card className="border-alert/40 bg-alert-light/40">
        <CardHeader>
          <CardTitle className="text-alert">Active health SOS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeSos.length === 0 ? (
            <p className="py-4 text-center text-sm text-ink-300">No active health emergencies.</p>
          ) : (
            activeSos.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-md border border-alert/30 bg-white p-3 text-sm dark:bg-transparent">
                <div>
                  <p className="font-medium">{s.student.fullName}</p>
                  <p className="text-xs text-ink-300">{s.reason ?? "—"} · {new Date(s.triggeredAt).toLocaleString()}</p>
                </div>
                <Badge variant="alert">{s.status}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vaccination campaigns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(campaigns ?? []).map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-md border border-line p-3 text-sm dark:border-line-dark">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-ink-300">{c.school.name} · Due {new Date(c.dueDate).toLocaleDateString()}</p>
              </div>
              <span className="text-sm font-semibold">{c.coverage}%</span>
            </div>
          ))}
          {(campaigns ?? []).length === 0 && <p className="text-sm text-ink-300">No campaigns tracked yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
