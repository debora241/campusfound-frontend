import { Users, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { TEACHER_CLASSES } from "./data";

export function TeacherClasses() {
  return (
    <div>
      <PageHeader title="Classes" description={`${TEACHER_CLASSES.length} classes assigned to you this term`} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEACHER_CLASSES.map((c) => (
          <Card key={c.id}>
            <CardContent>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-ink-300">{c.subject}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-300">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> {c.studentCount} students
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {c.nextLesson}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
