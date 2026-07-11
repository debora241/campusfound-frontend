import { useQuery } from "@tanstack/react-query";
import { School, GraduationCap, TrendingDown, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { governmentApi } from "@/lib/governmentApi";

export function NationalDashboard() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const enabled = !!accessToken;

  const { data: regionStats } = useQuery({ queryKey: ["gov-statistics"], queryFn: () => governmentApi.statistics.list(accessToken!), enabled });
  const { data: funding } = useQuery({ queryKey: ["gov-funding"], queryFn: () => governmentApi.funding.list(accessToken!), enabled });

  const totalSchools = (regionStats ?? []).reduce((s, r) => s + r.schools, 0);
  const totalStudents = (regionStats ?? []).reduce((s, r) => s + r.students, 0);
  const avgDropout = (regionStats ?? []).length > 0 ? (regionStats!.reduce((s, r) => s + r.dropoutRate, 0) / regionStats!.length).toFixed(1) : null;

  const totalAllocated = (funding ?? []).reduce((s, f) => s + Number(f.allocated), 0);
  const totalDisbursed = (funding ?? []).reduce((s, f) => s + Number(f.disbursed), 0);
  const disbursedPct = totalAllocated > 0 ? Math.round((totalDisbursed / totalAllocated) * 100) : null;

  return (
    <div className="space-y-6">
      <PageHeader title="National education dashboard" description="Ministry of Education overview" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total schools (sample regions)" value={totalSchools.toLocaleString()} icon={School} />
        <StatCard label="Total students (sample regions)" value={totalStudents > 0 ? (totalStudents / 1000).toFixed(0) + "k" : "—"} icon={GraduationCap} />
        <StatCard label="Avg. dropout rate" value={avgDropout ? `${avgDropout}%` : "—"} icon={TrendingDown} />
        <StatCard label="Funding disbursed" value={disbursedPct != null ? `${disbursedPct}%` : "—"} icon={Wallet} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students by region (reference data)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {(regionStats ?? []).length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-ink-300">No regional statistics available.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E1DC" vertical={false} />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip />
                <Bar dataKey="students" fill="#14213D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regional dropout heatmap (reference data)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(regionStats ?? []).map((r) => {
              const intensity = Math.min(r.dropoutRate / 15, 1);
              return (
                <div key={r.id} className="rounded-md p-3 text-center" style={{ backgroundColor: `rgba(179,67,43,${0.08 + intensity * 0.35})` }}>
                  <p className="text-xs font-medium text-ink-500 dark:text-ink-300">{r.region}</p>
                  <p className="mt-1 text-lg font-semibold text-alert">{r.dropoutRate}%</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-[11px] text-ink-300">
        Regional dropout rates are seeded reference data — the platform doesn't yet track enrollment history over time.
      </p>
    </div>
  );
}
