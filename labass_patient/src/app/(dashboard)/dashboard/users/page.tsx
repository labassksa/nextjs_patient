"use client";

import { useState, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useUsers, useCreateAdmin } from "@/features/dashboard/hooks/use-users";
import type { User } from "@/features/dashboard/types/user.types";
import { DataTable } from "@/features/dashboard/components/shared/data-table";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { StatusBadge } from "@/features/dashboard/components/shared/status-badge";
import { SearchInput } from "@/features/dashboard/components/shared/search-input";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function UsersPage() {
  const { data, isLoading, error, refetch } = useUsers();
  const createAdmin = useCreateAdmin();
  const [search, setSearch] = useState("");
  const [createDialog, setCreateDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleSearch = useCallback((value: string) => setSearch(value), []);

  const handleCreate = async () => {
    const formatted = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
    if (!/^\+\d{1,3}\d{7,14}$/.test(formatted)) {
      setPhoneError("Invalid phone (e.g. +966XXXXXXXXX)");
      return;
    }
    setPhoneError("");
    await createAdmin.mutateAsync({ phoneNumber: formatted, role: "admin" });
    setCreateDialog(false);
    setPhoneNumber("");
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: "firstName",
      header: "Name",
      cell: ({ row }) => {
        const name = `${row.original.firstName || ""} ${row.original.lastName || ""}`.trim();
        return <span className="font-medium">{name || "—"}</span>;
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => (
        <span className="font-mono text-sm" dir="ltr">{row.original.phoneNumber}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        const roleStr = Array.isArray(role) ? role.join(", ") : role;
        return <StatusBadge status={roleStr || "user"} />;
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.gender || "—"}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return date ? (
          <span className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString()}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
  ];

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const users = Array.isArray(data) ? data : [];

  return (
    <div>
      <PageHeader
        title="Users"
        description="View all users and create admin accounts"
        actions={
          <Button onClick={() => setCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Admin
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput placeholder="Search users..." onChange={handleSearch} className="max-w-sm" />
      </div>

      <DataTable columns={columns} data={users} isLoading={isLoading} searchKey="firstName" searchValue={search} exportFilename="users" />

      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Admin User</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value); setPhoneError(""); }}
                placeholder="+966XXXXXXXXX"
                dir="ltr"
              />
              {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createAdmin.isPending || !phoneNumber}>
              {createAdmin.isPending ? "Creating..." : "Create Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
