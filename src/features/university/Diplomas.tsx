import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { ShieldCheck, Search, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
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
import { universityApi, type UniBackendDiploma } from "@/lib/universityApi";
import { publicCredentialsApi } from "@/lib/credentialsApi";
import { ApiError } from "@/lib/apiClient";

const columns: ColumnDef<UniBackendDiploma, any>[] = [
  { id: "student", header: "Graduate", cell: ({ row }) => row.original.student.fullName },
  { id: "program", header: "Program", cell: ({ row }) => row.original.student.program ?? "—" },
  { accessorKey: "classification", header: "Classification", cell: ({ getValue }) => (getValue() as string) ?? "—" },
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

export function Diplomas() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [issueOpen, setIssueOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [classification, setClassification] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Awaited<ReturnType<typeof publicCredentialsApi.verify>> | null>(null);

  const { data: students } = useQuery({
    queryKey: ["university-students"],
    queryFn: () => universityApi.students.list(accessToken!),
    enabled: !!accessToken,
  });

  const { data: diplomas, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["university-diplomas"],
    queryFn: () => universityApi.diplomas.list(accessToken!),
    enabled: !!accessToken,
  });

  const issueMutation = useMutation({
    mutationFn: () => universityApi.diplomas.issue(accessToken!, { studentId, classification }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university-diplomas"] });
      toast.success("Diploma issued and anchored on-chain");
      setIssueOpen(false);
      setStudentId("");
      setClassification("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't issue diploma"),
  });

  const verify = async () => {
    try {
      setResult(await publicCredentialsApi.verify(query));
    } catch {
      setResult({ found: false });
    }
  };

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a University Administrator to manage diplomas</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load diplomas</p>
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
        title="Diplomas (blockchain)"
        description="Every diploma issued is anchored on-chain and publicly verifiable."
        actions={
          <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <ShieldCheck className="h-3.5 w-3.5" /> Issue diploma
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Issue a diploma</DialogTitle>
                <DialogDescription>Creates a real, verifiable credential.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="student">Graduate</Label>
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
                  <Label htmlFor="classification">Classification</Label>
                  <Input id="classification" placeholder="e.g. Upper Second Class" value={classification} onChange={(e) => setClassification(e.target.value)} />
                </div>
                <Button className="w-full" disabled={!studentId || !classification || issueMutation.isPending} onClick={() => issueMutation.mutate()}>
                  {issueMutation.isPending ? "Issuing…" : "Issue & anchor on-chain"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Public diploma verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs text-ink-300">
            Employers and institutions can verify a diploma's authenticity using the graduate's name or blockchain reference — no login required.
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
                <CheckCircle2 className="h-4 w-4" /> This diploma is authentic and verified on-chain.
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-alert-light px-3 py-2 text-sm text-alert">
                <XCircle className="h-4 w-4" /> No verified diploma matches that record.
              </div>
            )
          )}
        </CardContent>
      </Card>

      <DataTable columns={columns} data={diplomas ?? []} searchPlaceholder="Search by graduate or program…" emptyLabel={isLoading ? "Loading…" : "No diplomas issued yet."} />
    </div>
  );
}
