import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Video, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { healthApi, type BackendTelemedicineRequest } from "@/lib/healthApi";
import { ApiError } from "@/lib/apiClient";

const statusVariant = { pending: "gold", in_call: "verified", completed: "neutral" } as const;

export function Telemedicine() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();

  const { data: requests, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["health-telemedicine"],
    queryFn: () => healthApi.telemedicine.list(accessToken!),
    enabled: !!accessToken,
  });

  const joinMutation = useMutation({
    mutationFn: (id: string) => healthApi.telemedicine.join(accessToken!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-telemedicine"] });
      toast.success("Joining video consultation…");
    },
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a Health Partner to view telemedicine requests</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load telemedicine requests</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Telemedicine" description="Consultation requests from students and parents" />
      <div className="space-y-3">
        {(requests ?? []).map((r: BackendTelemedicineRequest) => (
          <Card key={r.id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{r.student.fullName}</p>
                  <Badge variant={statusVariant[r.status]}>{r.status.replace("_", " ")}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-300">{r.reason}</p>
                <p className="text-xs text-ink-300">Requested {new Date(r.requestedAt).toLocaleString()}</p>
              </div>
              {r.status === "pending" && (
                <Button size="sm" onClick={() => joinMutation.mutate(r.id)}>
                  <Video className="h-3.5 w-3.5" /> Join call
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {!isLoading && (requests ?? []).length === 0 && <p className="py-10 text-center text-sm text-ink-300">No telemedicine requests yet.</p>}
      </div>
    </div>
  );
}
