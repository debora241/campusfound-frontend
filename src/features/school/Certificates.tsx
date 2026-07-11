import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { ShieldCheck, AlertTriangle, RefreshCw, Search, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { VerificationSeal } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { schoolCredentialsApi, publicCredentialsApi, type BackendCredential } from "@/lib/credentialsApi";
import { studentsApi } from "@/lib/studentsApi";
import { ApiError } from "@/lib/apiClient";

const columns: ColumnDef<BackendCredential, any>[] = [
  { id: "student", header: "Student", cell: ({ row }) => row.original.student.fullName },
  { accessorKey: "type", header: "Document type", cell: ({ getValue }) => (getValue() as string).replace("_", " ") },
  { accessorKey: "issuedOn", header: "Issued", cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString() },
  {
    accessorKey: "txHash",
    header: "Blockchain reference",
    cell: ({ getValue }) => <code className="text-xs text-ink-300">{(getValue() as string) ?? "pending"}</code>,
  },
  {
    accessorKey: "verified",
    header: "Verification",
    cell: ({ getValue }) => (getValue() ? <VerificationSeal size="sm" /> : <span className="text-xs font-medium text-gold-dark">Pending…</span>),
  },
];

export function Certificates() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [issueOpen, setIssueOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [type, setType] = useState("report_card");
  const [classification, setClassification] = useState("");
  const [verifyQuery, setVerifyQuery] = useState("");
  const [verifyResult, setVerifyResult] = useState<Awaited<ReturnType<typeof publicCredentialsApi.verify>> | null>(null);

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentsApi.list(accessToken!),
    enabled: !!accessToken,
  });

  const { data: credentials, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["school-credentials"],
    queryFn: () => schoolCredentialsApi.list(accessToken!),
    enabled: !!accessToken,
  });

  const issueMutation = useMutation({
    mutationFn: () => schoolCredentialsApi.issue(accessToken!, { studentId, type, classification: classification || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-credentials"] });
      toast.success("Certificate issued and anchored on-chain");
      setIssueOpen(false);
      setStudentId("");
      setClassification("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't issue certificate"),
  });

  const runVerify = async () => {
    try {
      const result = await publicCredentialsApi.verify(verifyQuery);
      setVerifyResult(result);
    } catch {
      setVerifyResult({ found: false });
    }
  };

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a School Administrator to manage certificates</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load certificates</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates & diplomas"
        description="Every issued document is anchored on-chain and independently verifiable."
        actions={
          <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <ShieldCheck className="h-3.5 w-3.5" /> Issue certificate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Issue a certificate</DialogTitle>
                <DialogDescription>This creates a real, verifiable credential.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="student">Student</Label>
                  <select
                    id="student"
                    className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-ink dark:border-line-dark dark:bg-transparent dark:focus:border-white"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  >
                    <option value="" disabled>Select a student</option>
                    {(students ?? []).map((s) => (
                      <option key={s.id} value={s.id}>{s.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="type">Document type</Label>
                  <select
                    id="type"
                    className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-ink dark:border-line-dark dark:bg-transparent dark:focus:border-white"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="report_card">Report Card</option>
                    <option value="certificate">Certificate</option>
                    <option value="diploma">Diploma</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="classification">Classification (optional)</Label>
                  <Input id="classification" placeholder="e.g. Distinction" value={classification} onChange={(e) => setClassification(e.target.value)} />
                </div>
                <Button className="w-full" disabled={!studentId || issueMutation.isPending} onClick={() => issueMutation.mutate()}>
                  {issueMutation.isPending ? "Issuing…" : "Issue & anchor on-chain"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Public verification lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={verifyQuery}
              onChange={(e) => { setVerifyQuery(e.target.value); setVerifyResult(null); }}
              placeholder="Enter graduate name or blockchain reference…"
            />
            <Button onClick={runVerify}>
              <Search className="h-3.5 w-3.5" /> Verify
            </Button>
          </div>
          {verifyResult && (
            verifyResult.found ? (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-verified-light px-3 py-2 text-sm text-verified">
                <CheckCircle2 className="h-4 w-4" /> {verifyResult.student} — {verifyResult.type?.replace("_", " ")} verified authentic.
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-alert-light px-3 py-2 text-sm text-alert">
                <XCircle className="h-4 w-4" /> No verified credential matches that record.
              </div>
            )
          )}
        </CardContent>
      </Card>

      <DataTable columns={columns} data={credentials ?? []} searchPlaceholder="Search by student or document type…" emptyLabel={isLoading ? "Loading…" : "No certificates issued yet."} />
    </div>
  );
}
