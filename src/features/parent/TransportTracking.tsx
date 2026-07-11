import { useEffect, useState } from "react";
import { Bus, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CHILDREN } from "./data";

export function TransportTracking() {
  const [eta, setEta] = useState(12);

  useEffect(() => {
    const t = setInterval(() => setEta((e) => (e > 1 ? e - 1 : 12)), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <PageHeader title="Transport tracking" description="Live bus location for your children's routes" />

      <div className="space-y-4">
        {CHILDREN.map((child, i) => (
          <Card key={child.id}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full ${child.avatarColor}`} />
                  <div>
                    <p className="font-medium">{child.name}</p>
                    <p className="text-xs text-ink-300">Route {i === 0 ? "Bonaberi — Campus" : "Deido — Campus"}</p>
                  </div>
                </div>
                <Badge variant={i === 0 ? "verified" : "gold"}>{i === 0 ? "On time" : "5 min delay"}</Badge>
              </div>

              <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-ink-50 dark:bg-white/10">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-ink transition-all duration-1000 dark:bg-white"
                  style={{ width: `${100 - (i === 0 ? eta : eta + 5) * 6}%` }}
                />
                <Bus className="absolute -top-1.5 h-5 w-5 text-gold transition-all duration-1000" style={{ left: `${Math.max(0, 100 - (i === 0 ? eta : eta + 5) * 6 - 2)}%` }} />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-ink-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Approaching Akwa junction
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> ETA {i === 0 ? eta : eta + 5} min
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
