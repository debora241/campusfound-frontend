import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { LIBRARY_BOOKS, type LibraryBook } from "./data";

const statusVariant = { available: "verified", borrowed: "gold", reserved: "neutral" } as const;

const columns: ColumnDef<LibraryBook, any>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "author", header: "Author" },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>
        {row.original.dueDate && <span className="text-xs text-ink-300">Due {row.original.dueDate}</span>}
      </div>
    ),
  },
];

export function Library() {
  return (
    <div>
      <PageHeader title="Digital Library" description="Browse and borrow from your school's catalog" />
      <DataTable columns={columns} data={LIBRARY_BOOKS} searchPlaceholder="Search books, authors, subjects…" />
    </div>
  );
}
