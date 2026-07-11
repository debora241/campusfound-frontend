import { Users, ClipboardCheck, BookOpen, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TEACHER_CLASSES, ASSIGNMENTS } from "./data";

const statusVariant = { open: "neutral", grading: "gold", closed: "verified" } as const;

export function TeacherDashboard() {
  const totalStudents = TEACHER_CLASSES.reduce((s, c) => s + c.studentCount, 0);
  const pendingGrading = ASSIGNMENTS.filter((a) => a.status === "grading").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Welcome back, Mr. Fotso" description="Here's your teaching day at a glance." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Classes taught" value={String(TEACHER_CLASSES.length)} icon={BookOpen} />
        <StatCard label="Total students" value={String(totalStudents)} icon={Users} />
        <StatCard label="Assignments to grade" value={String(pendingGrading)} icon={ClipboardCheck} />
        <StatCard label="Next lesson" value="10:00 AM" icon={Clock} trend="Form 5A · Rm 12" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {TEACHER_CLASSES.filter((c) => c.nextLesson.startsWith("Today")).map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-md border border-line p-3 text-sm dark:border-line-dark">
              <div>
                <p className="font-medium">{c.name} — {c.subject}</p>
                <p className="text-xs text-ink-300">{c.studentCount} students</p>
              </div>
              <span className="text-xs text-ink-300">{c.nextLesson.split(", ")[1]}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignment status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ASSIGNMENTS.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-md border border-line p-3 text-sm dark:border-line-dark">
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-ink-300">{a.submissions}/{a.totalStudents} submitted · Due {a.dueDate}</p>
              </div>
              <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
