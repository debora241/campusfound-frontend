import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Wallet as WalletIcon, AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { studentApi, type StudentPayment } from "@/lib/studentApi";
import { ApiError } from "@/lib/apiClient";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);

const columns: ColumnDef<StudentPayment, any>[] = [
  { accessorKey: "paidOn", header: "Date", cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString() },
  { accessorKey: "method", header: "Method" },
  { accessorKey: "amount", header: "Amount", cell: ({ getValue }) => fmt(Number(getValue())) },
];

export function Wallet() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: fees, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["student-wallet"],
    queryFn: () => studentApi.getWallet(accessToken!),
    enabled: !!accessToken,
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load your wallet</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">
          {error instanceof ApiError ? error.message : "Check that the backend is running."}
        </p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  const totalDue = (fees ?? []).reduce((sum, f) => sum + Math.max(Number(f.amountDue) - Number(f.amountPaid), 0), 0);
  const allPayments = (fees ?? []).flatMap((f) => f.payments);

  return (
    <div>
      <PageHeader title="Wallet" description="Your fee balances and payment history" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Outstanding balance"
          value={fmt(totalDue)}
          icon={WalletIcon}
          trend={totalDue > 0 ? "Balance due" : "All paid"}
          trendUp={totalDue === 0}
        />
        <StatCard label="Fee records" value={String(fees?.length ?? 0)} icon={WalletIcon} />
        <StatCard label="Payments recorded" value={String(allPayments.length)} icon={WalletIcon} />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Fee balances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && <p className="text-sm text-ink-300">Loading…</p>}
          {(fees ?? []).map((fee) => {
            const balance = Math.max(Number(fee.amountDue) - Number(fee.amountPaid), 0);
            return (
              <div key={fee.id} className="flex items-center justify-between rounded-md border border-line p-3 dark:border-line-dark">
                <div>
                  <p className="text-xs text-ink-300">
                    {fmt(Number(fee.amountPaid))} paid of {fmt(Number(fee.amountDue))} · Due {new Date(fee.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={balance > 0 ? "text-xs font-medium text-alert" : "text-xs font-medium text-verified"}>
                  {balance > 0 ? `${fmt(balance)} due` : "Paid in full"}
                </span>
              </div>
            );
          })}
          {!isLoading && (fees ?? []).length === 0 && (
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
