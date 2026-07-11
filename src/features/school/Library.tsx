import type { ColumnDef } from "@tanstack/react-table";
import { BookPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LIBRARY_BOOKS, type LibraryBook } from "./data";

const columns: ColumnDef<LibraryBook, any>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "author", header: "Author" },
  { accessorKey: "copies", header: "Total copies" },
  {
    accessorKey: "available",
    header: "Available",
    cell: ({ getValue }) => {
      const n = getValue() as number;
      return <Badge variant={n === 0 ? "alert" : "verified"}>{n === 0 ? "None available" : `${n} available`}</Badge>;
    },
  },
];

export function Library() {
  return (
    <div>
      <PageHeader
        title="Library"
        description={`${LIBRARY_BOOKS.length} titles in the catalog`}
        actions={
          <Button size="sm">
            <BookPlus className="h-3.5 w-3.5" /> Add title
          </Button>
        }
      />
      <DataTable columns={columns} data={LIBRARY_BOOKS} searchPlaceholder="Search catalog…" />
    </div>
  );
}
