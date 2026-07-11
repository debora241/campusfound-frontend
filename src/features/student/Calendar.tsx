import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw, FileBadge2, ClipboardCheck, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { studentApi, type StudentCalendarEvent } from "@/lib/studentApi";
import { ApiError } from "@/lib/apiClient";

const typeMeta: Record<StudentCalendarEvent["type"], { icon: typeof FileBadge2; label: string }> = {
  exam: { icon: FileBadge2, label: "Exam" },
  attendance: { icon: ClipboardCheck, label: "Attendance" },
  announcement: { icon: Megaphone, label: "Announcement" },
};

export function Calendar() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["student-calendar"],
    queryFn: () => studentApi.getCalendar(accessToken!),
    enabled: !!accessToken,
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load your calendar</p>
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
    <div>
      <PageHeader title="Calendar" description="Exams, attendance, and announcements in one timeline" />
      <div className="space-y-2">
        {isLoading && <p className="py-10 text-center text-sm text-ink-300">Loading…</p>}
        {!isLoading && (data ?? []).length === 0 && (
          <p className="py-10 text-center text-sm text-ink-300">Nothing on your calendar yet.</p>
        )}
        {(data ?? []).map((event) => {
          const meta = typeMeta[event.type];
          const Icon = meta.icon;
          return (
            <div
              key={`${event.type}-${event.id}`}
              className="flex items-center gap-3 rounded-md border border-line p-3 text-sm dark:border-line-dark"
            >
              <div className="rounded-md bg-ink-50 p-2 dark:bg-white/5">
                <Icon className="h-4 w-4 text-ink-500 dark:text-ink-300" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-ink-300">{meta.label}</p>
              </div>
              <span className="text-xs text-ink-300">{new Date(event.date).toLocaleDateString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
