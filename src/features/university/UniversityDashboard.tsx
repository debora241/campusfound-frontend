import { useQuery } from "@tanstack/react-query";
import { GraduationCap, UserCheck, Wallet, ShieldCheck } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { universityApi } from "@/lib/universityApi";

const COLORS = ["#14213D", "#C89B3C", "#1F7A5C", "#B3432B", "#8492B8"];

export function UniversityDashboard() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const enabled = !!accessToken;

  const { data: students } = useQuery({ queryKey: ["university-students"], queryFn: () => universityApi.students.list(accessToken!), enabled });
  const { data: faculty } = useQuery({ queryKey: ["university-faculty"], queryFn: () => universityApi.faculty.list(accessToken!), enabled });
  const { data: programs } = useQuery({ queryKey: ["university-programs"], queryFn: () => universityApi.programs.list(accessToken!), enabled });
  const { data: fees } = useQuery({ queryKey: ["university-finance"], queryFn: () => universityApi.finance.list(accessToken!), enabled });
  const { data: diplomas } = useQuery({ queryKey: ["university-diplomas"], queryFn: () => universityApi.diplomas.list(accessToken!), enabled });

  const totalDue = (fees ?? []).reduce((s, f) => s + Number(f.amountDue), 0);
  const totalPaid = (fees ?? []).reduce((s, f) => s + Number(f.amountPaid), 0);
  const collectionRate = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : null;
  const verifiedDiplomas = (diplomas ?? []).filter((d) => d.verified).length;

  const chartData = (programs ?? [])
    .filter((p) => p.enrolled > 0)
    .map((p) => ({ name: p.name.replace(/^B\.\w+\.?\s?/, "").replace("Doctor of ", ""), value: p.enrolled }));

  return (
    <div className="space-y-6">
      <PageHeader title="University overview" description="Real-time data for your institution" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total enrolled" value={enabled ? String(students?.length ?? "…") : "—"} icon={GraduationCap} />
        <StatCard label="Faculty members" value={enabled ? String(faculty?.length ?? "…") : "—"} icon={UserCheck} />
        <StatCard label="Fees collected" value={collectionRate != null ? `${collectionRate}%` : "—"} icon={Wallet} />
        <StatCard label="Diplomas verified" value={String(verifiedDiplomas)} icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enrollment by program</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {chartData.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-ink-300">No enrolled students yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recently issued diplomas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(diplomas ?? []).length === 0 && <p className="text-sm text-ink-300">No diplomas issued yet.</p>}
            {(diplomas ?? []).slice(0, 3).map((d) => (
              <div key={d.id} className="rounded-md border border-line p-3 text-sm dark:border-line-dark">
                <p className="font-medium">{d.student.fullName}</p>
                <p className="text-xs text-ink-300">{d.student.program ?? "—"} · {new Date(d.issuedOn).toLocaleDateString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
