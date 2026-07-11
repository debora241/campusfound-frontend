import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw, Users, ClipboardCheck, BookOpen, Award } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { teacherApi } from "@/lib/teacherApi";
import { ApiError } from "@/lib/apiClient";

const statusVariant = { scheduled: "neutral", in_progress: "gold", graded: "verified" } as const;

export function TeacherDashboard() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["teacher-dashboard"],
    queryFn: () => teacherApi.getDashboard(accessToken!),
    enabled: !!accessToken,
  });

  const { data: assignments } = useQuery({
    queryKey: ["teacher-assignments"],
    queryFn: () => teacherApi.getAssignments(accessToken!),
    enabled: !!accessToken,
  });

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
        description="Here's your teaching day at a glance."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Classes taught" value={String(data?.classesTaught ?? 0)} icon={BookOpen} />
        <StatCard label="Total students" value={String(data?.totalStudents ?? 0)} icon={Users} />
        <StatCard label="Assignments to grade" value={String(data?.assignmentsToGrade ?? 0)} icon={ClipboardCheck} />
        <StatCard label="Exams graded" value={String(data?.examsGraded ?? 0)} icon={Award} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your classes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data?.classes.length ?? 0) === 0 ? (
            <p className="py-6 text-center text-sm text-ink-300">No classes assigned to you yet.</p>
          ) : (
            data!.classes.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-md border border-line p-3 text-sm dark:border-line-dark">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-ink-300">{c.studentCount} students{c.room ? ` · Room ${c.room}` : ""}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignment status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(assignments?.length ?? 0) === 0 ? (
            <p className="py-6 text-center text-sm text-ink-300">No assignments created yet.</p>
          ) : (
            assignments!.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-md border border-line p-3 text-sm dark:border-line-dark">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-xs text-ink-300">{a.className} · Due {new Date(a.dueDate).toLocaleDateString()}</p>
                </div>
                <Badge variant={statusVariant[a.status]}>{a.status.replace("_", " ")}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
