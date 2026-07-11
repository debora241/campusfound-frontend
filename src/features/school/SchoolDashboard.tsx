import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, Wallet, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hooks";
import { studentsApi } from "@/lib/studentsApi";
import { teachersApi } from "@/lib/teachersApi";
import { schoolFeesApi } from "@/lib/schoolFeesApi";
import { schoolDisciplineApi } from "@/lib/schoolDisciplineApi";
import { schoolAnnouncementsApi } from "@/lib/schoolAnnouncementsApi";

const ENROLLMENT_TREND = [
  { term: "T1", students: 940 },
  { term: "T2", students: 972 },
  { term: "T3", students: 1005 },
  { term: "T4 (now)", students: 1042 },
];

export function SchoolDashboard() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const enabled = !!accessToken;

  const { data: students } = useQuery({ queryKey: ["students"], queryFn: () => studentsApi.list(accessToken!), enabled });
  const { data: teachers } = useQuery({ queryKey: ["teachers"], queryFn: () => teachersApi.list(accessToken!), enabled });
  const { data: fees } = useQuery({ queryKey: ["school-fees"], queryFn: () => schoolFeesApi.list(accessToken!), enabled });
  const { data: cases } = useQuery({ queryKey: ["school-discipline"], queryFn: () => schoolDisciplineApi.list(accessToken!), enabled });
  const { data: announcements } = useQuery({ queryKey: ["school-announcements"], queryFn: () => schoolAnnouncementsApi.list(accessToken!), enabled });

  const totalDue = (fees ?? []).reduce((s, f) => s + Number(f.amountDue), 0);
  const totalPaid = (fees ?? []).reduce((s, f) => s + Number(f.amountPaid), 0);
  const collectionRate = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : null;
  const openCases = (cases ?? []).filter((c) => c.status === "open");
  const pinned = (announcements ?? []).filter((a) => a.pinned);

  return (
    <div>
      <PageHeader title="School overview" description="Real-time data for your school" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total students" value={enabled ? String(students?.length ?? "…") : "—"} icon={Users} />
        <StatCard label="Teaching staff" value={enabled ? String(teachers?.length ?? "…") : "—"} icon={UserCheck} />
        <StatCard label="Fees collected" value={collectionRate != null ? `${collectionRate}%` : "—"} icon={Wallet} />
        <StatCard label="Open discipline cases" value={String(openCases.length)} icon={AlertTriangle} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enrollment trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ENROLLMENT_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E1DC" vertical={false} />
                <XAxis dataKey="term" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip cursor={{ fill: "rgba(20,33,61,0.04)" }} />
                <Bar dataKey="students" fill="#14213D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-center text-[11px] text-ink-300">Illustrative trend — historical enrollment isn't tracked yet.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pinned announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pinned.length === 0 && <p className="text-sm text-ink-300">No pinned announcements.</p>}
            {pinned.map((a) => (
              <div key={a.id} className="rounded-md border border-line p-3 text-sm dark:border-line-dark">
                <p className="font-medium">{a.title}</p>
                <p className="mt-1 text-xs text-ink-300">{a.audience} · {new Date(a.publishedOn).toLocaleDateString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Open discipline cases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {openCases.length === 0 && <p className="text-sm text-ink-300">No open cases.</p>}
          {openCases.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-md border border-line p-3 text-sm dark:border-line-dark">
              <div>
                <p className="font-medium">{c.student.fullName}</p>
                <p className="text-xs text-ink-300">{c.incident}</p>
              </div>
              <Badge variant={c.severity === "severe" ? "alert" : "gold"}>{c.severity}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
