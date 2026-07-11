import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw, FileBadge2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, VerificationSeal } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { studentApi } from "@/lib/studentApi";
import { ApiError } from "@/lib/apiClient";

const typeLabel = { report_card: "Report card", certificate: "Certificate", diploma: "Diploma" } as const;

export function SkillPassport() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: credentials, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["student-credentials"],
    queryFn: () => studentApi.getCredentials(accessToken!),
    enabled: !!accessToken,
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load your Skill Passport</p>
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
      <PageHeader
        title="Skill Passport"
        description={isLoading ? "Loading…" : `${credentials?.length ?? 0} verified credentials on your record`}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(credentials ?? []).map((c) => (
          <Card key={c.id}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-gold-light p-2">
                    <FileBadge2 className="h-4 w-4 text-gold-dark" />
                  </div>
                  <div>
                    <p className="font-semibold">{typeLabel[c.type]}</p>
                    {c.classification && <p className="text-xs text-ink-300">{c.classification}</p>}
                  </div>
                </div>
                {c.verified ? <VerificationSeal size="sm" /> : <Badge variant="neutral">Pending</Badge>}
              </div>
              <p className="mt-3 text-xs text-ink-300">Issued {new Date(c.issuedOn).toLocaleDateString()}</p>
              {c.txHash && <p className="mt-1 truncate font-mono text-[10px] text-ink-300">{c.txHash}</p>}
            </CardContent>
          </Card>
        ))}
        {!isLoading && (credentials ?? []).length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-ink-300">
            No credentials issued yet — report cards, certificates, and diplomas will appear here as your institution issues them.
          </p>
        )}
      </div>
    </div>
  );
}
