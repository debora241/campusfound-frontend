import { useQuery } from "@tanstack/react-query";
import { MapPin, Users, AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { policeApi } from "@/lib/policeApi";
import { ApiError } from "@/lib/apiClient";

export function Geofencing() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: zones, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["police-geofences"],
    queryFn: () => policeApi.geofences.list(accessToken!),
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Police to view geo-fencing zones</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load geo-fencing zones</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Geo-fencing" description={isLoading ? "Loading…" : `${zones?.length ?? 0} monitored school perimeters`} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(zones ?? []).map((zone) => (
          <Card key={zone.id} className={zone.status === "breach" ? "border-alert/40" : undefined}>
            <CardContent>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <MapPin className={`mt-0.5 h-4 w-4 ${zone.status === "breach" ? "text-alert" : "text-ink-300"}`} />
                  <div>
                    <p className="font-medium">{zone.name}</p>
                    <p className="text-xs text-ink-300">{zone.school?.name} · Radius: {zone.radiusMeters}m</p>
                  </div>
                </div>
                <Badge variant={zone.status === "breach" ? "alert" : "verified"}>{zone.status}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-300">
                <Users className="h-3.5 w-3.5" /> {zone.studentsInZone.toLocaleString()} students tracked in zone
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && (zones ?? []).length === 0 && <p className="col-span-full py-10 text-center text-sm text-ink-300">No geo-fencing zones configured yet.</p>}
      </div>
    </div>
  );
}
