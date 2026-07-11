import { useState } from "react";
import { QrCode, ScanLine, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VerificationSeal } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hooks";
import { policeApi, type StudentVerificationResult } from "@/lib/policeApi";
import { ApiError } from "@/lib/apiClient";

export function QrScanner() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<StudentVerificationResult | null>(null);

  const scan = async () => {
    if (!query.trim() || !accessToken) return;
    setScanning(true);
    setResult(null);
    try {
      const found = await policeApi.verify(accessToken, query.trim());
      setResult(found);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Lookup failed");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div>
      <PageHeader title="QR scanner" description="Look up a student's ID, matricule, or name to verify identity instantly" />

      <div className="flex flex-col items-center gap-6 py-6">
        <div className="flex w-full max-w-sm gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Scan or type Student ID / matricule / name…"
            onKeyDown={(e) => e.key === "Enter" && scan()}
          />
          <Button onClick={scan} disabled={scanning || !accessToken}>
            {scanning ? <ScanLine className="h-4 w-4 animate-pulse" /> : <QrCode className="h-4 w-4" />}
          </Button>
        </div>

        {result && result.found && (
          <Card className="w-full max-w-sm">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gold-light" />
                <div>
                  <p className="font-semibold">{result.name}</p>
                  <p className="text-xs text-ink-300">{result.identifier}</p>
                </div>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-300">Institution</dt>
                  <dd>{result.institution ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-300">Guardian phone</dt>
                  <dd>{result.guardianPhone ?? "Not on file"}</dd>
                </div>
              </dl>
              <div className="mt-4 border-t border-line pt-3 dark:border-line-dark">
                <VerificationSeal label="Identity verified" />
              </div>
              <Button variant="secondary" className="mt-4 w-full" onClick={() => { setResult(null); setQuery(""); }}>
                Scan another
              </Button>
            </CardContent>
          </Card>
        )}

        {result && !result.found && (
          <div className="flex items-center gap-2 rounded-md bg-alert-light px-3 py-2 text-sm text-alert">
            <XCircle className="h-4 w-4" /> No student found matching that ID or name.
          </div>
        )}
      </div>
    </div>
  );
}
