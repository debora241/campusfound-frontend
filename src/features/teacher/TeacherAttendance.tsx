import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TEACHER_CLASSES, CLASS_STUDENTS } from "./data";

type Status = "present" | "absent" | "late";

const STATUS_STYLES: Record<Status, string> = {
  present: "bg-verified text-white",
  absent: "bg-alert text-white",
  late: "bg-gold text-ink",
};

export function TeacherAttendance() {
  const [classId, setClassId] = useState(TEACHER_CLASSES[0].id);
  const students = useMemo(() => CLASS_STUDENTS.filter((s) => s.classId === classId), [classId]);
  const [marks, setMarks] = useState<Record<string, Status>>(
    Object.fromEntries(students.map((s) => [s.id, "present" as Status]))
  );

  const setClass = (id: string) => {
    setClassId(id);
    const newStudents = CLASS_STUDENTS.filter((s) => s.classId === id);
    setMarks(Object.fromEntries(newStudents.map((s) => [s.id, "present" as Status])));
  };

  const setMark = (id: string, status: Status) => setMarks((m) => ({ ...m, [id]: status }));

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Mark today's attendance for your class"
        actions={
          <Button
            size="sm"
            onClick={() => toast.success(`Attendance saved for ${TEACHER_CLASSES.find((c) => c.id === classId)?.name}`)}
          >
            Save attendance
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {TEACHER_CLASSES.map((c) => (
          <button
            key={c.id}
            onClick={() => setClass(c.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              classId === c.id
                ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink"
                : "border-line text-ink-500 dark:border-line-dark dark:text-ink-300"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-line dark:border-line-dark">
        {students.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "flex items-center justify-between px-4 py-3 text-sm",
              i !== 0 && "border-t border-line dark:border-line-dark"
            )}
          >
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-xs text-ink-300">{s.id}</p>
            </div>
            <div className="flex gap-1.5">
              {(["present", "late", "absent"] as Status[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setMark(s.id, status)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
                    marks[s.id] === status ? STATUS_STYLES[status] : "bg-ink-50 text-ink-500 dark:bg-white/5 dark:text-ink-300"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
