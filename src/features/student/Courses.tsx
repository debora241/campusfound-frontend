import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { studentApi } from "@/lib/studentApi";
import { ApiError } from "@/lib/apiClient";

export function Courses() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: courses, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["student-courses"],
    queryFn: () => studentApi.getCourses(accessToken!),
    enabled: !!accessToken,
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load your courses</p>
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
      <PageHeader title="Courses" description={isLoading ? "Loading…" : `${courses?.length ?? 0} courses this term`} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(courses ?? []).map((c) => (
          <Card key={c.id}>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-ink-50 p-2 dark:bg-white/5">
                  <BookOpen className="h-4 w-4 text-ink-500 dark:text-ink-300" />
                </div>
                <div>
                  <p className="font-semibold">{c.name}</p>
                  {c.instructor && <p className="text-xs text-ink-300">{c.instructor}</p>}
                </div>
              </div>
              {c.meta && <p className="mt-3 text-xs text-ink-300">{c.meta}</p>}
            </CardContent>
          </Card>
        ))}
        {!isLoading && (courses ?? []).length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-ink-300">
            No courses on record yet — they appear here once your institution enrolls you in a class or program.
          </p>
        )}
      </div>
    </div>
  );
}
