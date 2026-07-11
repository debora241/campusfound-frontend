import { ShieldAlert, Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EMERGENCY_ALERTS } from "./data";

const severityVariant = { info: "neutral", warning: "gold", critical: "alert" } as const;

export function EmergencyAlerts() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Emergency alerts"
        description="Notifications involving your children's safety"
        actions={
          <Button variant="destructive" size="sm">
            <Phone className="h-3.5 w-3.5" /> Contact school now
          </Button>
        }
      />

      {EMERGENCY_ALERTS.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center text-sm text-ink-300">
            <ShieldAlert className="mb-2 h-6 w-6" />
            No emergency alerts. Everything looks calm.
          </CardContent>
        </Card>
      ) : (
        EMERGENCY_ALERTS.map((alert) => (
          <Card key={alert.id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-4 w-4 text-ink-300" />
                <div>
                  <p className="text-sm font-medium">{alert.type}</p>
                  <p className="text-xs text-ink-300">{alert.child} · {alert.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={severityVariant[alert.severity]}>{alert.severity}</Badge>
                {alert.resolved && <Badge variant="verified">resolved</Badge>}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
