import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/store/hooks";
import { universityApi, type UniBackendFaculty } from "@/lib/universityApi";
import { ApiError } from "@/lib/apiClient";

const columns: ColumnDef<UniBackendFaculty, any>[] = [
  { accessorKey: "fullName", header: "Faculty member" },
  { accessorKey: "department", header: "Department", cell: ({ getValue }) => (getValue() as string) ?? "—" },
  { accessorKey: "subject", header: "Rank", cell: ({ getValue }) => (getValue() as string) ?? "—" },
  { accessorKey: "staffId", header: "Staff ID", cell: ({ getValue }) => (getValue() as string) ?? "—" },
];

export function UniversityFaculty() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");

  const { data: faculty, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["university-faculty"],
    queryFn: () => universityApi.faculty.list(accessToken!),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: () => universityApi.faculty.create(accessToken!, { fullName, department, subject }),
    onSuccess: (member) => {
      queryClient.invalidateQueries({ queryKey: ["university-faculty"] });
      toast.success(`${member.fullName} added`);
      setOpen(false);
      setFullName("");
      setDepartment("");
      setSubject("");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't add faculty member"),
  });

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Sign in as a University Administrator to manage faculty</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load faculty</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">{error instanceof ApiError ? error.message : "Check that the backend is running."}</p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Faculty"
        description={isLoading ? "Loading…" : `${faculty?.length ?? 0} faculty members`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-3.5 w-3.5" /> Add faculty
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a faculty member</DialogTitle>
                <DialogDescription>Creates a real record in the staff roster.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" placeholder="e.g. Computer Science" value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="subject">Rank (optional)</Label>
                  <Input id="subject" placeholder="e.g. Senior Lecturer" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <Button className="w-full" disabled={!fullName || !department || createMutation.isPending} onClick={() => createMutation.mutate()}>
                  {createMutation.isPending ? "Adding…" : "Add faculty member"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable columns={columns} data={faculty ?? []} searchPlaceholder="Search faculty…" emptyLabel={isLoading ? "Loading…" : "No faculty members yet."} />
    </div>
  );
}
