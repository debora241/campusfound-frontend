import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { alumniApi, type BackendMentorship } from "@/lib/alumniApi";
import { ApiError } from "@/lib/apiClient";

const statusVariant = { requested: "gold", active: "verified", completed: "neutral" } as const;

export function Mentorship() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();

  const { data: mentorships, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["alumni-mentorship"],
    queryFn: () => alumniApi.mentorship.list(accessToken!),
    enabled: !!accessToken,
  });

  const acceptMutation = useMutation({
    mutationFn: (id: string) => alumniApi.mentorship.accept(accessToken!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni-mentorship"] });
      toast.success("Mentorship accepted");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't accept mentorship"),
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Alumni to view mentorship requests</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load mentorships</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Mentorship" description="Guide the next generation of students" />
      <div className="space-y-3">
        {(mentorships ?? []).map((m: BackendMentorship) => (
          <Card key={m.id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{m.student.fullName}</p>
                  <Badge variant={statusVariant[m.status]}>{m.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-300">{m.topic}</p>
                <p className="text-xs text-ink-300">Requested {new Date(m.requestedOn).toLocaleDateString()}</p>
              </div>
              {m.status === "requested" && (
                <Button size="sm" onClick={() => acceptMutation.mutate(m.id)}>
                  Accept
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {!isLoading && (mentorships ?? []).length === 0 && <p className="py-10 text-center text-sm text-ink-300">No mentorship requests yet.</p>}
      </div>
    </div>
  );
}
