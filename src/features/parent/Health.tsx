import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HeartPulse, ShieldAlert, Phone, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { parentApi } from "@/lib/parentApi";
import { ApiError } from "@/lib/apiClient";

function ChildMedicalCard({ studentId, fullName, accessToken }: { studentId: string; fullName: string; accessToken: string }) {
  const { data: record, isLoading } = useQuery({
    queryKey: ["parent-medical", studentId],
    queryFn: () => parentApi.getMedicalRecord(accessToken, studentId),
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gold-light" />
          <CardTitle className="text-sm font-semibold text-ink dark:text-white">{fullName}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3 rounded-md border border-line p-3 dark:border-line-dark">
          <HeartPulse className="mt-0.5 h-4 w-4 text-alert" />
          <div>
            <p className="text-xs text-ink-300">Blood group</p>
            <p className="text-sm font-medium">{isLoading ? "Loading…" : record?.bloodGroup ?? "Not on file"}</p>
            <p className="mt-2 text-xs text-ink-300">Allergies</p>
            <p className="text-sm font-medium">{isLoading ? "Loading…" : record?.allergies ?? "None recorded"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Health() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [sosChildId, setSosChildId] = useState<string | null>(null);

  const { data: children } = useQuery({
    queryKey: ["parent-children"],
    queryFn: () => parentApi.listChildren(accessToken!),
    enabled: !!accessToken,
  });

  const sosMutation = useMutation({
    mutationFn: ({ studentId, reason }: { studentId: string; reason: string }) => parentApi.sendSos(accessToken!, studentId, reason),
    onSuccess: (_data, variables) => {
      toast.success("SOS sent — health partner notified");
      setSosChildId(variables.studentId);
      queryClient.invalidateQueries({ queryKey: ["health-sos"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't send SOS"),
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a Parent to view health information</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Health" description="Medical records, vaccinations, and emergency assistance" />

      <Card className="border-alert/40 bg-alert-light/50">
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-alert" />
            <div>
              <p className="font-medium text-alert">Emergency SOS</p>
              <p className="text-xs text-alert/80">Alerts the nearest health partner immediately for the first linked child.</p>
            </div>
          </div>
          <Button
            variant="destructive"
            disabled={!children?.length || sosMutation.isPending}
            onClick={() => children?.[0] && sosMutation.mutate({ studentId: children[0].id, reason: "Parent-initiated emergency SOS" })}
          >
            <Phone className="h-4 w-4" /> {sosMutation.isPending ? "Sending…" : sosChildId ? "SOS sent" : "Send SOS"}
          </Button>
        </CardContent>
      </Card>

      {(children ?? []).map((child) => (
        <ChildMedicalCard key={child.id} studentId={child.id} fullName={child.fullName} accessToken={accessToken} />
      ))}
      {(children ?? []).length === 0 && <p className="py-10 text-center text-sm text-ink-300">No children linked to your account yet.</p>}
    </div>
  );
}
