import { useQuery } from "@tanstack/react-query";
import { Download, Share2, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { VerificationSeal } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { alumniApi } from "@/lib/alumniApi";
import { ApiError } from "@/lib/apiClient";

export function AlumniDiplomaVerification() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: diploma, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["alumni-diploma"],
    queryFn: () => alumniApi.diploma.getMine(accessToken!),
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Alumni to view your diploma</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load your diploma</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Diploma verification" description="Your verified academic credentials" />
        <p className="text-sm text-ink-300">Loading…</p>
      </div>
    );
  }

  if (!diploma?.found) {
    return (
      <div>
        <PageHeader title="Diploma verification" description="Your verified academic credentials" />
        <Card className="max-w-lg">
          <CardContent className="py-10 text-center text-sm text-ink-300">
            No diploma on file matching your account name yet. If you believe this is an error, contact your institution's administration
            to confirm your record uses the same full name as your CampusFound profile.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Diploma verification" description="Your verified academic credentials" />
      <Card className="max-w-lg">
        <CardContent>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-serif text-lg font-semibold">{diploma.program ?? "Diploma"}</p>
              <p className="text-sm text-ink-300">{diploma.classification ?? "—"}</p>
              <p className="mt-1 text-xs text-ink-300">Issued {diploma.issuedOn && new Date(diploma.issuedOn).toLocaleDateString()}</p>
            </div>
            {diploma.verified && <VerificationSeal />}
          </div>
          <div className="mt-4 rounded-md bg-ink-50 p-3 text-xs text-ink-300 dark:bg-white/5">
            Blockchain reference: <code>{diploma.txHash}</code>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => toast.info("Downloading PDF isn't wired to a document generator yet")}>
              <Download className="h-3.5 w-3.5" /> Download PDF
            </Button>
            <Button size="sm" variant="secondary" onClick={() => toast.success("Verification link copied")}>
              <Share2 className="h-3.5 w-3.5" /> Share verification link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
