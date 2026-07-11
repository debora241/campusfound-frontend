import { useQuery } from "@tanstack/react-query";
import { Users, MapPin, AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { teacherApi } from "@/lib/teacherApi";
import { ApiError } from "@/lib/apiClient";

export function TeacherClasses() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: classes, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: () => teacherApi.getClasses(accessToken!),
    enabled: !!accessToken,
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load your classes</p>
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
      <PageHeader title="Classes" description={isLoading ? "Loading…" : `${classes?.length ?? 0} classes assigned to you this term`} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(classes ?? []).map((c) => (
          <Card key={c.id}>
            <CardContent>
              <p className="font-semibold">{c.name}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-300">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> {c.studentCount} students
                </span>
                {c.room && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> Room {c.room}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && (classes ?? []).length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-ink-300">No classes assigned to you yet.</p>
        )}
      </div>
    </div>
  );
}
