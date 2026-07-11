import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Wallet, AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { governmentApi, type BackendFundingRecord } from "@/lib/governmentApi";
import { ApiError } from "@/lib/apiClient";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);
const complianceVariant = { compliant: "verified", under_review: "gold", non_compliant: "alert" } as const;

const columns: ColumnDef<BackendFundingRecord, any>[] = [
  { id: "school", header: "School", cell: ({ row }) => row.original.school.name },
  { accessorKey: "region", header: "Region" },
  { accessorKey: "allocated", header: "Allocated", cell: ({ getValue }) => fmt(Number(getValue())) },
  { accessorKey: "disbursed", header: "Disbursed", cell: ({ getValue }) => fmt(Number(getValue())) },
  {
    accessorKey: "compliance",
    header: "Compliance",
    cell: ({ getValue }) => <Badge variant={complianceVariant[getValue() as BackendFundingRecord["compliance"]]}>{(getValue() as string).replace("_", " ")}</Badge>,
  },
];

export function Funding() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: funding, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["gov-funding"],
    queryFn: () => governmentApi.funding.list(accessToken!),
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as Government to view funding</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load funding records</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  const totalAllocated = (funding ?? []).reduce((s, f) => s + Number(f.allocated), 0);
  const totalDisbursed = (funding ?? []).reduce((s, f) => s + Number(f.disbursed), 0);
  const flagged = (funding ?? []).filter((f) => f.compliance !== "compliant").length;

  return (
    <div>
      <PageHeader title="Funding & compliance" description="Education budget allocation and compliance tracking" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total allocated" value={fmt(totalAllocated)} icon={Wallet} />
        <StatCard label="Disbursed" value={totalAllocated > 0 ? `${Math.round((totalDisbursed / totalAllocated) * 100)}%` : "—"} icon={Wallet} trend={fmt(totalDisbursed)} trendUp />
        <StatCard label="Flagged for review" value={String(flagged)} icon={AlertTriangle} />
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={funding ?? []} searchPlaceholder="Search by school or region…" emptyLabel={isLoading ? "Loading…" : "No funding records yet."} />
      </div>
    </div>
  );
}
