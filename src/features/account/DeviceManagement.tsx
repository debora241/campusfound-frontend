import { useState } from "react";
import { Laptop, Smartphone, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Device {
  id: string;
  name: string;
  type: "mobile" | "desktop";
  location: string;
  lastActive: string;
  current: boolean;
}

const INITIAL_DEVICES: Device[] = [
  { id: "1", name: "iPhone 14 — Douala", type: "mobile", location: "Douala, Cameroon", lastActive: "Active now", current: true },
  { id: "2", name: "Chrome on Windows", type: "desktop", location: "Yaoundé, Cameroon", lastActive: "2 days ago", current: false },
];

export function DeviceManagement() {
  const [devices, setDevices] = useState(INITIAL_DEVICES);

  const revoke = (id: string) => {
    setDevices((d) => d.filter((device) => device.id !== id));
    toast.success("Device removed");
  };

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center text-sm text-ink-300">
        <Laptop className="mb-3 h-6 w-6" />
        No trusted devices linked to your account.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {devices.map((device) => {
        const Icon = device.type === "mobile" ? Smartphone : Laptop;
        return (
          <Card key={device.id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-ink-300" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{device.name}</p>
                    {device.current && <Badge variant="verified">This device</Badge>}
                  </div>
                  <p className="text-xs text-ink-300">
                    {device.location} · {device.lastActive}
                  </p>
                </div>
              </div>
              {!device.current && (
                <Button variant="ghost" size="icon" aria-label="Revoke device" onClick={() => revoke(device.id)}>
                  <X className="h-4 w-4 text-alert" />
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
