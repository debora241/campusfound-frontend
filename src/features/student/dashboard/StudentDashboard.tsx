import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw, BookOpen, TrendingUp, Sparkles, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, VerificationSeal } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAppSelector } from "@/store/hooks";
import { studentApi } from "@/lib/studentApi";
import { ApiError } from "@/lib/apiClient";

export function StudentDashboard() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () => studentApi.getDashboard(accessToken!),
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a Student to view your dashboard</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load your dashboard</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">
          {error instanceof ApiError ? error.message : "Check that the backend is running."}
        </p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isLoading ? "Welcome back" : `Welcome back, ${data!.fullName.split(" ")[0]}`}
        description={
          isLoading
            ? "Loading…"
            : [data!.className ?? data!.program, data!.institutionName].filter(Boolean).join(" · ") || "Here's your academic snapshot."
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="GPA" value={data?.gpa != null ? data.gpa.toFixed(1) : "—"} icon={TrendingUp} />
        <StatCard
          label="Attendance"
          value={data?.attendanceRate != null ? `${data.attendanceRate}%` : "No data yet"}
          icon={BookOpen}
        />
        <StatCard label="Upcoming assessments" value={String(data?.upcoming.length ?? 0)} icon={Sparkles} />
        <StatCard label="Credentials earned" value={String(data?.credentialCount ?? 0)} icon={Award} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming assessments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data?.upcoming.length ?? 0) === 0 ? (
            <p className="py-6 text-center text-sm text-ink-300">Nothing scheduled right now.</p>
          ) : (
            data!.upcoming.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-md border border-line p-3 text-sm dark:border-line-dark">
                <p className="font-medium">{u.title}</p>
                <span className="text-xs text-ink-300">{new Date(u.due).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent grades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data?.recentGrades.length ?? 0) === 0 ? (
            <p className="py-6 text-center text-sm text-ink-300">No grades recorded yet.</p>
          ) : (
            data!.recentGrades.map((g) => (
              <div key={g.id} className="flex items-center justify-between rounded-md border border-line p-3 text-sm dark:border-line-dark">
                <p className="font-medium">{g.title}</p>
                <Badge variant={g.score / g.maxScore >= 0.5 ? "verified" : "alert"}>
                  {g.score}/{g.maxScore}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {(data?.credentialCount ?? 0) > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm">You have {data!.credentialCount} verified credential(s) on your Skill Passport.</p>
            <VerificationSeal size="sm" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
