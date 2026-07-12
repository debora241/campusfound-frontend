import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { studentApi, type StudentLibraryBook } from "@/lib/studentApi";
import { ApiError } from "@/lib/apiClient";

const statusVariant = { available: "verified", borrowed_by_me: "gold", unavailable: "neutral" } as const;
const statusLabel = { available: "available", borrowed_by_me: "borrowed by you", unavailable: "unavailable" } as const;

const columns: ColumnDef<StudentLibraryBook, any>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "author", header: "Author" },
  { accessorKey: "category", header: "Category", cell: ({ getValue }) => (getValue() as string) ?? "—" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant={statusVariant[row.original.status]}>{statusLabel[row.original.status]}</Badge>
        {row.original.dueDate && <span className="text-xs text-ink-300">Due {new Date(row.original.dueDate).toLocaleDateString()}</span>}
      </div>
    ),
  },
];

export function Library() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const { data: books, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["student-library"],
    queryFn: () => studentApi.getLibrary(accessToken!),
    enabled: !!accessToken,
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load the library</p>
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
      <PageHeader title="Digital Library" description="Browse and borrow from your school's catalog" />
      <DataTable
        columns={columns}
        data={books ?? []}
        searchPlaceholder="Search books, authors, subjects…"
        emptyLabel={isLoading ? "Loading…" : "No books in the catalog yet."}
      />
    </div>
  );
}
