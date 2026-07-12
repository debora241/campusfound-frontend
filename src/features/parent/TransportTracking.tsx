import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bus, AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { parentApi } from "@/lib/parentApi";
import { ApiError } from "@/lib/apiClient";

export function TransportTracking() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const [eta, setEta] = useState(12);

  useEffect(() => {
    const t = setInterval(() => setEta((e) => (e > 1 ? e - 1 : 12)), 4000);
    return () => clearInterval(t);
  }, []);

  const { data: children } = useQuery({
    queryKey: ["parent-children"],
    queryFn: () => parentApi.listChildren(accessToken!),
    enabled: !!accessToken,
  });

  const { data: routesByChild, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["parent-transport", (children ?? []).map((c) => c.id)],
    queryFn: async () => {
      const results = await Promise.all(
        (children ?? []).map(async (c) => ({ child: c, route: await parentApi.getTransport(accessToken!, c.id) }))
      );
      return results;
    },
    enabled: !!accessToken && (children ?? []).length > 0,
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load transport info</p>
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
      <PageHeader title="Transport tracking" description="Bus route assignment for your children" />

      <div className="space-y-4">
        {isLoading && <p className="py-10 text-center text-sm text-ink-300">Loading…</p>}
        {(routesByChild ?? []).map(({ child, route }, i) => (
          <Card key={child.id}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gold-light" />
                  <div>
                    <p className="font-medium">{child.fullName}</p>
                    <p className="text-xs text-ink-300">{route ? route.routeName : "No route assigned"}</p>
                  </div>
                </div>
                {route && <Badge variant={route.status === "on_time" ? "verified" : "gold"}>{route.status.replace("_", " ")}</Badge>}
              </div>

              {route && (
                <>
                  <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-ink-50 dark:bg-white/10">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-ink transition-all duration-1000 dark:bg-white"
                      style={{ width: `${100 - (i === 0 ? eta : eta + 5) * 6}%` }}
                    />
                    <Bus
                      className="absolute -top-1.5 h-5 w-5 text-gold transition-all duration-1000"
                      style={{ left: `${Math.max(0, 100 - (i === 0 ? eta : eta + 5) * 6 - 2)}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-ink-300">
                    <span>{route.driverName ? `Driver: ${route.driverName}` : "Driver not assigned"}</span>
                    <span>ETA {i === 0 ? eta : eta + 5} min</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
        {!isLoading && (children ?? []).length === 0 && (
          <p className="py-10 text-center text-sm text-ink-300">No children linked to your account yet.</p>
        )}
      </div>
    </div>
  );
}
