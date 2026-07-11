import { useQuery } from "@tanstack/react-query";
import { Users, Trophy, CalendarDays, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { VerificationSeal } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hooks";
import { alumniApi } from "@/lib/alumniApi";

export function AlumniDashboard() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const enabled = !!accessToken;

  const { data: network } = useQuery({ queryKey: ["alumni-network"], queryFn: () => alumniApi.network.list(accessToken!), enabled });
  const { data: mentorships } = useQuery({ queryKey: ["alumni-mentorship"], queryFn: () => alumniApi.mentorship.list(accessToken!), enabled });
  const { data: events } = useQuery({ queryKey: ["alumni-events"], queryFn: () => alumniApi.events.list(accessToken!), enabled });
  const { data: diploma } = useQuery({ queryKey: ["alumni-diploma"], queryFn: () => alumniApi.diploma.getMine(accessToken!), enabled });

  return (
    <div className="space-y-6">
      <PageHeader title="Welcome back" description="Your alumni network and credentials at a glance." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Network size" value={String(network?.length ?? "—")} icon={Users} />
        <StatCard label="Active mentorships" value={String((mentorships ?? []).filter((m) => m.status === "active").length)} icon={Trophy} />
        <StatCard label="Upcoming events" value={String(events?.length ?? 0)} icon={CalendarDays} />
        <StatCard label="Verified credentials" value={diploma?.found ? "1" : "0"} icon={ShieldCheck} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your diploma</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          {diploma?.found ? (
            <>
              <div>
                <p className="font-medium">{diploma.program} — {diploma.classification}</p>
                <p className="text-xs text-ink-300">Issued {diploma.issuedOn && new Date(diploma.issuedOn).toLocaleDateString()}</p>
              </div>
              <VerificationSeal />
            </>
          ) : (
            <p className="text-sm text-ink-300">No diploma on file matching your account yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(events ?? []).map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-md border border-line p-3 text-sm dark:border-line-dark">
              <div>
                <p className="font-medium">{e.title}</p>
                <p className="text-xs text-ink-300">{new Date(e.date).toLocaleDateString()} · {e.location}</p>
              </div>
              <span className="text-xs text-ink-300">{e.attending} attending</span>
            </div>
          ))}
          {(events ?? []).length === 0 && <p className="text-sm text-ink-300">No events scheduled yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
