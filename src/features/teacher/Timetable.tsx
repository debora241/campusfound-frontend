import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { teacherApi } from "@/lib/teacherApi";
import { ApiError } from "@/lib/apiClient";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

export function Timetable() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: entries, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["teacher-timetable"],
    queryFn: () => teacherApi.getTimetable(accessToken!),
    enabled: !!accessToken,
  });

  const slots = Array.from(new Set((entries ?? []).map((e) => `${e.startTime} – ${e.endTime}`))).sort();

  const lookup = (day: string, slot: string) =>
    (entries ?? []).find((e) => e.day === day && `${e.startTime} – ${e.endTime}` === slot);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load your timetable</p>
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
      <PageHeader title="Timetable" description="Your weekly teaching schedule" />
      {isLoading ? (
        <p className="py-10 text-center text-sm text-ink-300">Loading…</p>
      ) : slots.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-300">No timetable entries yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line dark:border-line-dark">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 dark:bg-white/5">
              <tr>
                <th className="w-32 px-4 py-2.5 text-left text-xs font-medium text-ink-500 dark:text-ink-300">Time</th>
                {DAYS.map((d) => (
                  <th key={d} className="px-4 py-2.5 text-left text-xs font-medium text-ink-500 dark:text-ink-300">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map((slot, i) => (
                <tr key={slot} className={i !== 0 ? "border-t border-line dark:border-line-dark" : ""}>
                  <td className="px-4 py-3 text-xs text-ink-300">{slot}</td>
                  {DAYS.map((d) => {
                    const entry = lookup(d, slot);
                    return (
                      <td key={d} className="px-4 py-3">
                        {entry ? (
                          <div className="rounded-md bg-ink-50 px-2.5 py-1.5 text-xs dark:bg-white/5">
                            <p className="font-medium">{entry.className}</p>
                            {entry.room && <p className="text-ink-300">Room {entry.room}</p>}
                          </div>
                        ) : (
                          <span className="text-xs text-ink-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
