import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle2, XCircle, ShieldCheck, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NATIONAL_DIPLOMAS } from "@/features/government/data";

export function GuestDiplomaVerification() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<"idle" | "found" | "not-found">("idle");

  const verify = () => {
    const match = NATIONAL_DIPLOMAS.find(
      (d) => d.txHash.toLowerCase() === query.toLowerCase() || d.student.toLowerCase() === query.toLowerCase()
    );
    setResult(match?.verified ? "found" : "not-found");
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper px-4 py-10 dark:bg-paper-dark">
      <div className="mx-auto w-full max-w-lg">
        <button
          onClick={() => navigate("/welcome")}
          className="mb-6 flex items-center gap-1.5 text-sm text-ink-300 hover:text-ink dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Exit guest mode
        </button>

        <Card>
          <CardHeader>
            <CardTitle>Public diploma verification</CardTitle>
            <ShieldCheck className="h-4 w-4 text-verified" />
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-xs text-ink-300">
              Anyone can verify a CampusFound-issued credential here — no account required. Search by graduate name or
              blockchain reference.
            </p>
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setResult("idle");
                }}
                placeholder="Enter graduate name or blockchain reference…"
              />
              <Button onClick={verify}>
                <Search className="h-3.5 w-3.5" /> Verify
              </Button>
            </div>
            {result === "found" && (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-verified-light px-3 py-2 text-sm text-verified">
                <CheckCircle2 className="h-4 w-4" /> Credential is authentic and anchored on the national registry.
              </div>
            )}
            {result === "not-found" && (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-alert-light px-3 py-2 text-sm text-alert">
                <XCircle className="h-4 w-4" /> No verified credential matches that record.
              </div>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-ink-300">
          Want more? <button onClick={() => navigate("/welcome")} className="font-medium text-ink underline dark:text-white">Create an account</button> to access your dashboard.
        </p>
      </div>
    </div>
  );
}
