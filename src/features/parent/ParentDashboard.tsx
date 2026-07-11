import { useQuery } from "@tanstack/react-query";
import { Wallet, ShieldAlert, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hooks";
import { parentApi } from "@/lib/parentApi";
import { MESSAGES } from "./data";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);

export function ParentDashboard() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: children, isLoading, isError } = useQuery({
    queryKey: ["parent-children"],
    queryFn: () => parentApi.listChildren(accessToken!),
    enabled: !!accessToken,
  });

  const totalDue = (children ?? []).reduce((s, c) => s + Math.max(c.feesDue - c.feesPaid, 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Welcome back" description="Here's how your children are doing today." />

      {!accessToken ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-line py-16 text-center dark:border-line-dark">
          <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
          <p className="font-medium">Sign in as a Parent to see live data</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-line py-16 text-center dark:border-line-dark">
          <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
          <p className="font-medium">Couldn't load your children</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {isLoading && <p className="text-sm text-ink-300">Loading…</p>}
          {(children ?? []).map((child) => (
            <Card key={child.id}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold-light" />
                  <div>
                    <p className="font-semibold">{child.fullName}</p>
                    <p className="text-xs text-ink-300">
                      {child.className ?? "—"} {child.school ? `· ${child.school}` : ""}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md bg-ink-50 py-2 dark:bg-white/5">
                    <p className="text-xs text-ink-300">Attendance</p>
                    <p className="text-sm font-semibold">{child.attendanceRate != null ? `${child.attendanceRate}%` : "—"}</p>
                  </div>
                  <div className="rounded-md bg-ink-50 py-2 dark:bg-white/5">
                    <p className="text-xs text-ink-300">GPA</p>
                    <p className="text-sm font-semibold">{child.gpa != null ? child.gpa.toFixed(1) : "—"}</p>
                  </div>
                  <div className="rounded-md bg-ink-50 py-2 dark:bg-white/5">
                    <p className="text-xs text-ink-300">Fees</p>
                    <p className="text-sm font-semibold">{child.feesDue > 0 ? `${Math.round((child.feesPaid / child.feesDue) * 100)}%` : "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {!isLoading && (children ?? []).length === 0 && (
            <p className="col-span-full py-6 text-center text-sm text-ink-300">No children linked to your account yet.</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Fees outstanding</CardTitle>
            <Wallet className="h-4 w-4 text-alert" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{fmt(totalDue)}</p>
            <p className="mt-1 text-xs text-ink-300">Across all children</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MESSAGES.slice(0, 2).map((m) => (
              <div key={m.id} className="flex items-start justify-between gap-3 rounded-md border border-line p-3 text-sm dark:border-line-dark">
                <div>
                  <p className="font-medium">{m.from}</p>
                  <p className="mt-0.5 text-xs text-ink-300">{m.preview}</p>
                </div>
                {m.unread && <Badge variant="gold">new</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-alert/30 bg-alert-light/40">
        <CardContent className="flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-alert" />
          <p className="text-sm text-alert">
            Emergency SOS is always available from the Health tab if you need immediate school or medical assistance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
