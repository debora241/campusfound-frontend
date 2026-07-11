import { useState } from "react";
import { Search, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { publicCredentialsApi, type VerificationResult } from "@/lib/credentialsApi";

export function PublicDiplomaVerification() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);

  const verify = async () => {
    try {
      setResult(await publicCredentialsApi.verify(query));
    } catch {
      setResult({ found: false });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Public diploma verification"
        description="A national registry of every credential issued across CampusFound-connected institutions."
      />

      <Card>
        <CardHeader>
          <CardTitle>Verify a credential</CardTitle>
          <ShieldCheck className="h-4 w-4 text-verified" />
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs text-ink-300">
            Search by graduate name or blockchain reference. This tool is publicly accessible — no government login required, and it queries the same real credential registry every school and university issues into.
          </p>
          <div className="flex gap-2">
            <Input value={query} onChange={(e) => { setQuery(e.target.value); setResult(null); }} placeholder="Enter graduate name or blockchain reference…" />
            <Button onClick={verify}>
              <Search className="h-3.5 w-3.5" /> Verify
            </Button>
          </div>
          {result && (
            result.found ? (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-verified-light px-3 py-2 text-sm text-verified">
                <CheckCircle2 className="h-4 w-4" /> {result.student} — {result.type?.replace("_", " ")} verified authentic on {result.issuedOn && new Date(result.issuedOn).toLocaleDateString()}.
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-alert-light px-3 py-2 text-sm text-alert">
                <XCircle className="h-4 w-4" /> No verified credential matches that record.
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
