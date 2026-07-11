import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { alumniApi } from "@/lib/alumniApi";
import { ApiError } from "@/lib/apiClient";

export function AlumniEvents() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();

  const { data: events, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["alumni-events"],
    queryFn: () => alumniApi.events.list(accessToken!),
    enabled: !!accessToken,
  });

  const rsvpMutation = useMutation({
    mutationFn: (id: string) => alumniApi.events.rsvp(accessToken!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni-events"] });
      toast.success("RSVP confirmed");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't RSVP"),
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Alumni to view events</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load events</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Events" description="Alumni gatherings and networking opportunities" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(events ?? []).map((e) => (
          <Card key={e.id}>
            <CardContent>
              <p className="font-semibold">{e.title}</p>
              <p className="mt-1 text-sm text-ink-300">{new Date(e.date).toLocaleDateString()} · {e.location}</p>
              <p className="mt-1 text-xs text-ink-300">{e.attending} alumni attending</p>
              <Button
                className="mt-4 w-full"
                variant={e.rsvped ? "secondary" : "primary"}
                disabled={e.rsvped || rsvpMutation.isPending}
                onClick={() => rsvpMutation.mutate(e.id)}
              >
                {e.rsvped ? "You're attending" : "RSVP"}
              </Button>
            </CardContent>
          </Card>
        ))}
        {!isLoading && (events ?? []).length === 0 && <p className="col-span-full py-10 text-center text-sm text-ink-300">No events scheduled yet.</p>}
      </div>
    </div>
  );
}
