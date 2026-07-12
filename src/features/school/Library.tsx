import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { schoolLibraryApi, type BackendBook } from "@/lib/schoolLibraryApi";
import { ApiError } from "@/lib/apiClient";

const schema = z.object({
  title: z.string().min(1, "Enter a title"),
  author: z.string().min(1, "Enter an author"),
  category: z.string().optional(),
  totalCopies: z.coerce.number().int().positive().default(1),
});
type FormValues = z.infer<typeof schema>;

const columns: ColumnDef<BackendBook, any>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "author", header: "Author" },
  { accessorKey: "category", header: "Category", cell: ({ getValue }) => (getValue() as string) ?? "—" },
  {
    id: "availability",
    header: "Availability",
    cell: ({ row }) => (
      <Badge variant={row.original.availableCopies > 0 ? "verified" : "alert"}>
        {row.original.availableCopies}/{row.original.totalCopies} available
      </Badge>
    ),
  },
];

export function Library() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: books, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["school-library"],
    queryFn: () => schoolLibraryApi.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => schoolLibraryApi.create(accessToken!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-library"] });
      toast.success("Book added");
      reset();
      setOpen(false);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't add book"),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { totalCopies: 1 },
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load the library catalog</p>
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
        title="Library"
        description={isLoading ? "Loading…" : `${books?.length ?? 0} titles in the catalog`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" /> Add title
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a book</DialogTitle>
                <DialogDescription>Creates a real catalog entry for this school.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit((v) => createMutation.mutate(v))} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" error={errors.title?.message} {...register("title")} />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" error={errors.author?.message} {...register("author")} />
                </div>
                <div>
                  <Label htmlFor="category">Category (optional)</Label>
                  <Input id="category" {...register("category")} />
                </div>
                <div>
                  <Label htmlFor="totalCopies">Copies</Label>
                  <Input id="totalCopies" type="number" min={1} {...register("totalCopies")} />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting || createMutation.isPending}>
                  {createMutation.isPending ? "Adding…" : "Add book"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable
        columns={columns}
        data={books ?? []}
        searchPlaceholder="Search books, authors, subjects…"
        emptyLabel={isLoading ? "Loading…" : "No books in the catalog yet."}
      />
    </div>
  );
}
