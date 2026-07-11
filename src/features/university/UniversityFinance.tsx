import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Wallet, TrendingDown, AlertTriangle, Download, RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { universityApi, type UniBackendFee } from "@/lib/universityApi";
import { ApiError } from "@/lib/apiClient";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);
const statusVariant = { paid: "verified", partial: "gold", overdue: "alert" } as const;

export function UniversityFinance() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [payTarget, setPayTarget] = useState<UniBackendFee | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Mobile Money");
  const [newStudentId, setNewStudentId] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  const { data: students } = useQuery({
    queryKey: ["university-students"],
    queryFn: () => universityApi.students.list(accessToken!),
    enabled: !!accessToken,
  });

  const { data: fees, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["university-finance"],
    queryFn: () => universityApi.finance.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: () => universityApi.finance.create(accessToken!, { studentId: newStudentId, amountDue: Number(newAmount), dueDate: newDueDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university-finance"] });
      toast.success("Fee record created");
      setCreateOpen(false);
      setNewStudentId("");
      setNewAmount("");
      setNewDueDate("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't create fee record"),
  });

  const payMutation = useMutation({
    mutationFn: () => universityApi.finance.pay(accessToken!, payTarget!.id, { amount: Number(payAmount), method: payMethod }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university-finance"] });
      toast.success("Payment recorded");
      setPayTarget(null);
      setPayAmount("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Payment failed"),
  });

  const columns: ColumnDef<UniBackendFee, any>[] = [
    { id: "student", header: "Student", cell: ({ row }) => row.original.student.fullName },
    { id: "program", header: "Program", cell: ({ row }) => row.original.student.program ?? "—" },
    { accessorKey: "amountDue", header: "Amount due", cell: ({ getValue }) => fmt(Number(getValue())) },
    { accessorKey: "amountPaid", header: "Amount paid", cell: ({ getValue }) => fmt(Number(getValue())) },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <Badge variant={statusVariant[getValue() as UniBackendFee["status"]]}>{getValue() as string}</Badge>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        row.original.status !== "paid" ? (
          <Button size="sm" variant="secondary" onClick={() => { setPayTarget(row.original); setPayAmount(""); }}>
            Record payment
          </Button>
        ) : null,
    },
  ];

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a University Administrator to manage finance</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load finance records</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  const totalDue = (fees ?? []).reduce((s, f) => s + Number(f.amountDue), 0);
  const totalPaid = (fees ?? []).reduce((s, f) => s + Number(f.amountPaid), 0);

  return (
    <div>
      <PageHeader
        title="Finance"
        description="Real tuition and fee records"
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Download className="h-3.5 w-3.5" /> Export statement
            </Button>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-3.5 w-3.5" /> New fee record
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create fee record</DialogTitle>
                  <DialogDescription>Assign tuition to a student.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="student">Student</Label>
                    <select
                      id="student"
                      className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-ink dark:border-line-dark dark:bg-transparent dark:focus:border-white"
                      value={newStudentId}
                      onChange={(e) => setNewStudentId(e.target.value)}
                    >
                      <option value="" disabled>Select a student</option>
                      {(students ?? []).map((s) => (
                        <option key={s.id} value={s.id}>{s.fullName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount due (XAF)</Label>
                    <Input id="amount" type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due date</Label>
                    <Input id="dueDate" type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
                  </div>
                  <Button className="w-full" disabled={!newStudentId || !newAmount || !newDueDate || createMutation.isPending} onClick={() => createMutation.mutate()}>
                    {createMutation.isPending ? "Creating…" : "Create record"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total collected" value={fmt(totalPaid)} icon={Wallet} trend={`of ${fmt(totalDue)} due`} trendUp />
        <StatCard label="Collection rate" value={totalDue > 0 ? `${Math.round((totalPaid / totalDue) * 100)}%` : "—"} icon={TrendingDown} />
        <StatCard label="Records" value={String(fees?.length ?? 0)} icon={AlertTriangle} />
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={fees ?? []} searchPlaceholder="Search by student…" emptyLabel={isLoading ? "Loading…" : "No fee records yet."} />
      </div>

      <Dialog open={!!payTarget} onOpenChange={(o) => !o && setPayTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record a payment</DialogTitle>
            <DialogDescription>{payTarget && `For ${payTarget.student.fullName}`}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="payAmount">Amount</Label>
              <Input id="payAmount" type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="payMethod">Method</Label>
              <Input id="payMethod" value={payMethod} onChange={(e) => setPayMethod(e.target.value)} />
            </div>
            <Button className="w-full" disabled={!payAmount || payMutation.isPending} onClick={() => payMutation.mutate()}>
              {payMutation.isPending ? "Recording…" : "Record payment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
