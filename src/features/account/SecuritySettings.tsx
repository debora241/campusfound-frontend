import { useState } from "react";
import { KeyRound, Fingerprint, ShieldCheck, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";

const LOGIN_HISTORY = [
  { device: "iPhone 14 — CampusFound app", location: "Douala, Cameroon", time: "Today, 8:12 AM", outcome: "Success" },
  { device: "Chrome on Windows", location: "Yaoundé, Cameroon", time: "Jul 2, 6:40 PM", outcome: "Success" },
  { device: "Unknown device", location: "Lagos, Nigeria", time: "Jun 28, 2:03 AM", outcome: "Blocked — too many attempts" },
];

export function SecuritySettings() {
  const biometricEnabled = useAppSelector((s) => s.auth.biometricEnabled);
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <KeyRound className="h-4 w-4 text-ink-300" />
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-ink-300">Last changed 3 months ago</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => toast.info("Password change flow")}>
            Change
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Fingerprint className="h-4 w-4 text-ink-300" />
            <div>
              <p className="text-sm font-medium">Biometric login</p>
              <p className="text-xs text-ink-300">
                {biometricEnabled ? "Enabled on this device" : "Not enabled"}
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-verified">{biometricEnabled ? "On" : "Off"}</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-ink-300" />
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-xs text-ink-300">Require an SMS code on new devices</p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={twoFactor}
            onClick={() => setTwoFactor((v) => !v)}
            className={`h-6 w-11 rounded-full transition-colors ${twoFactor ? "bg-verified" : "bg-ink-50 dark:bg-white/10"}`}
          >
            <span
              className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${
                twoFactor ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <History className="h-4 w-4 text-ink-300" /> Login history
          </div>
          <div className="space-y-2">
            {LOGIN_HISTORY.map((entry, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border border-line p-2.5 text-sm dark:border-line-dark">
                <div>
                  <p className="font-medium">{entry.device}</p>
                  <p className="text-xs text-ink-300">{entry.location} · {entry.time}</p>
                </div>
                <span className={`text-xs font-medium ${entry.outcome === "Success" ? "text-verified" : "text-alert"}`}>
                  {entry.outcome}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
