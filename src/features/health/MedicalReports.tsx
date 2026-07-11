import { useQuery } from "@tanstack/react-query";
import { FileText, AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { healthApi } from "@/lib/healthApi";
import { ApiError } from "@/lib/apiClient";

export function MedicalReports() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: reports, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["health-reports"],
    queryFn: () => healthApi.reports.list(accessToken!),
    enabled: !!accessToken,
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load reports</p>
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
      <PageHeader title="Medical reports" description="Summaries generated from real vaccination and telemedicine activity" />
      <div className="space-y-3">
        {isLoading && <p className="py-10 text-center text-sm text-ink-300">Loading…</p>}
        {(reports ?? []).map((r) => (
          <Card key={r.id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-ink-300" />
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-ink-300">
                    {r.school} · {r.metric} · Generated {new Date(r.generatedOn).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && (reports ?? []).length === 0 && (
          <p className="py-10 text-center text-sm text-ink-300">No activity to summarize yet.</p>
        )}
      </div>
    </div>
  );
}
