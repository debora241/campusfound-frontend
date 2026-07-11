import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { parentApi } from "@/lib/parentApi";
import { ApiError } from "@/lib/apiClient";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);

export function ChildrenOverview() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: children, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["parent-children"],
    queryFn: () => parentApi.listChildren(accessToken!),
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a Parent to view your children</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">This page reads real data from the CampusFound backend.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load your children</p>
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
      <PageHeader
        title="Children overview"
        description={isLoading ? "Loading…" : `${children?.length ?? 0} children linked to your account`}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {(children ?? []).map((child) => (
          <Card key={child.id}>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gold-light" />
                <div>
                  <p className="font-semibold">{child.fullName}</p>
                  <p className="text-xs text-ink-300">
                    {child.className ?? "—"} {child.school ? `· ${child.school}` : ""}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-ink-300">Current GPA</dt>
                  <dd className="font-medium">{child.gpa != null ? child.gpa.toFixed(1) : "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-300">Attendance</dt>
                  <dd className="font-medium">{child.attendanceRate != null ? `${child.attendanceRate}%` : "No data yet"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-300">Fees status</dt>
                  <dd>
                    <Badge variant={child.feesPaid >= child.feesDue ? "verified" : "gold"}>
                      {child.feesPaid >= child.feesDue ? "Paid in full" : `${fmt(child.feesDue - child.feesPaid)} due`}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-300">Relationship</dt>
                  <dd className="font-medium">{child.relationship ?? "—"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
        {!isLoading && (children ?? []).length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-ink-300">
            No children are linked to your account yet.
          </p>
        )}
      </div>
    </div>
  );
}
