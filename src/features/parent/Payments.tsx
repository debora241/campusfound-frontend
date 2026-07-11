import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { CreditCard, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { parentApi, type BackendFeeRecord, type BackendPayment } from "@/lib/parentApi";
import { ApiError } from "@/lib/apiClient";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);

interface PaymentRow extends BackendPayment {
  childName: string;
}

const columns: ColumnDef<PaymentRow, any>[] = [
  { accessorKey: "paidOn", header: "Date", cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString() },
  { accessorKey: "childName", header: "Child" },
  { accessorKey: "method", header: "Method" },
  { accessorKey: "amount", header: "Amount", cell: ({ getValue }) => fmt(Number(getValue())) },
];

export function Payments() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [openFeeId, setOpenFeeId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Mobile Money");

  const { data: children } = useQuery({
    queryKey: ["parent-children"],
    queryFn: () => parentApi.listChildren(accessToken!),
    enabled: !!accessToken,
  });

  const feeQueries = (children ?? []).map((child) => ({
    childId: child.id,
    childName: child.fullName,
  }));

  const { data: feesByChild, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["parent-fees", feeQueries.map((f) => f.childId)],
    queryFn: async () => {
      const results = await Promise.all(
        feeQueries.map(async (f) => ({
          ...f,
          fees: await parentApi.getFees(accessToken!, f.childId),
        }))
      );
      return results;
    },
    enabled: !!accessToken && feeQueries.length > 0,
  });

  const payMutation = useMutation({
    mutationFn: ({ studentId, feeId, amount, method }: { studentId: string; feeId: string; amount: number; method: string }) =>
      parentApi.payFee(accessToken!, studentId, feeId, { amount, method }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent-fees"] });
      queryClient.invalidateQueries({ queryKey: ["parent-children"] });
      toast.success("Payment submitted");
      setOpenFeeId(null);
      setPayAmount("");
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Payment failed");
    },
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a Parent to manage payments</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load fees</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">
          {error instanceof ApiError ? error.message : "Check that the backend is running."}
        </p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  const totalDue = (feesByChild ?? []).reduce(
    (sum, c) => sum + c.fees.reduce((s, f) => s + Math.max(Number(f.amountDue) - Number(f.amountPaid), 0), 0),
    0
  );

  const allPayments: PaymentRow[] = (feesByChild ?? []).flatMap((c) =>
    c.fees.flatMap((f) => f.payments.map((p) => ({ ...p, childName: c.childName })))
  );

  return (
    <div>
      <PageHeader title="Payments & fees" description="Real fee balances and payment history from the backend" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total fees outstanding" value={fmt(totalDue)} icon={CreditCard} trend={totalDue > 0 ? "Payment recommended" : "All paid"} trendUp={totalDue === 0} />
        <StatCard label="Children covered" value={String(children?.length ?? 0)} icon={CreditCard} />
        <StatCard label="Payments recorded" value={String(allPayments.length)} icon={CreditCard} />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Fee balances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && <p className="text-sm text-ink-300">Loading…</p>}
          {(feesByChild ?? []).map((c) =>
            c.fees.map((fee: BackendFeeRecord) => {
              const balance = Math.max(Number(fee.amountDue) - Number(fee.amountPaid), 0);
              return (
                <div key={fee.id} className="flex items-center justify-between rounded-md border border-line p-3 dark:border-line-dark">
                  <div>
                    <p className="text-sm font-medium">{c.childName}</p>
                    <p className="text-xs text-ink-300">
                      {fmt(Number(fee.amountPaid))} paid of {fmt(Number(fee.amountDue))} · Due {new Date(fee.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  {balance > 0 ? (
                    <Dialog open={openFeeId === fee.id} onOpenChange={(o) => setOpenFeeId(o ? fee.id : null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setPayAmount(String(balance))}>
                          Pay {fmt(balance)}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Pay school fees</DialogTitle>
                          <DialogDescription>For {c.childName} — {fmt(balance)} outstanding</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="amount">Amount</Label>
                            <Input id="amount" type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor="method">Payment method</Label>
                            <Input id="method" value={payMethod} onChange={(e) => setPayMethod(e.target.value)} />
                          </div>
                          <Button
                            className="w-full"
                            disabled={payMutation.isPending}
                            onClick={() =>
                              payMutation.mutate({
                                studentId: c.childId,
                                feeId: fee.id,
                                amount: Number(payAmount),
                                method: payMethod,
                              })
                            }
                          >
                            {payMutation.isPending ? "Submitting…" : "Confirm payment"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <span className="text-xs font-medium text-verified">Paid in full</span>
                  )}
                </div>
              );
            })
          )}
          {!isLoading && (feesByChild ?? []).every((c) => c.fees.length === 0) && (
            <p className="py-6 text-center text-sm text-ink-300">No fee records yet.</p>
          )}
        </CardContent>
      </Card>

      <div className="mt-4">
        <h2 className="mb-3 text-sm font-medium text-ink-500 dark:text-ink-300">Payment history</h2>
        <DataTable columns={columns} data={allPayments} searchPlaceholder="Search payments…" emptyLabel="No payments recorded yet." />
      </div>
    </div>
  );
}
