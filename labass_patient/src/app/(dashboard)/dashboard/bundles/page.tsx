"use client";

import { useState, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useBundles, useCreateBundle, useToggleBundleActive, useDeleteBundle } from "@/features/dashboard/hooks/use-bundles";
import type { Bundle, CreateBundlePayload } from "@/features/dashboard/types/bundle.types";
import { DataTable } from "@/features/dashboard/components/shared/data-table";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { StatusBadge } from "@/features/dashboard/components/shared/status-badge";
import { SearchInput } from "@/features/dashboard/components/shared/search-input";
import { ConfirmDialog } from "@/features/dashboard/components/shared/confirm-dialog";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

const CURRENCIES = ["SAR", "KWD", "AED", "BHD", "OMR", "QAR", "USD", "EUR"] as const;
const RECURRING_TYPES = ["Daily", "Weekly", "Monthly", "Custom"] as const;
const BUNDLE_TYPES = ["GP Consultations", "Specialist Consultations"] as const;
const BUNDLE_NAMES = ["basic", "standard", "premium"] as const;

export default function BundlesPage() {
  const { data, isLoading, error, refetch } = useBundles();
  const createBundle = useCreateBundle();
  const toggleActive = useToggleBundleActive();
  const deleteBundle = useDeleteBundle();
  const [search, setSearch] = useState("");
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [newBundle, setNewBundle] = useState<CreateBundlePayload>({
    name: "basic", type: "GP Consultations", price: 0, consultationCount: 0,
    currency: "SAR", recurringType: "Monthly", description: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSearch = useCallback((value: string) => setSearch(value), []);

  const validateBundle = (): boolean => {
    const errors: Record<string, string> = {};
    if (!newBundle.name) {
      errors.name = "Please select a name";
    }
    if (!newBundle.consultationCount || newBundle.consultationCount < 1 || !Number.isInteger(newBundle.consultationCount)) {
      errors.consultationCount = "Must be a positive integer";
    }
    if (newBundle.price < 0) {
      errors.price = "Price must be non-negative";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateBundle()) return;
    await createBundle.mutateAsync(newBundle);
    setCreateDialog(false);
    setNewBundle({ name: "basic", type: "GP Consultations", price: 0, consultationCount: 0, currency: "SAR", recurringType: "Monthly", description: "" });
    setFormErrors({});
  };

  const handleDelete = async () => {
    if (deleteDialog.id) {
      await deleteBundle.mutateAsync(deleteDialog.id);
    }
    setDeleteDialog({ open: false, id: null });
  };

  const columns: ColumnDef<Bundle>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal capitalize">{row.original.type}</Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          {row.original.price} <span className="text-muted-foreground">{row.original.currency || "SAR"}</span>
        </span>
      ),
    },
    {
      accessorKey: "consultationCount",
      header: "Consultations",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">{row.original.consultationCount}</Badge>
      ),
    },
    {
      accessorKey: "recurringType",
      header: "Recurring",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">{row.original.recurringType}</Badge>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => toggleActive.mutate(row.original.id)}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => setDeleteDialog({ open: true, id: row.original.id })}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const bundles = Array.isArray(data) ? data : [];

  return (
    <div>
      <PageHeader
        title="Bundles"
        description="Manage consultation bundles"
        actions={
          <Button onClick={() => setCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Bundle
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput placeholder="Search bundles..." onChange={handleSearch} className="max-w-sm" />
      </div>

      <DataTable columns={columns} data={bundles} isLoading={isLoading} searchKey="name" searchValue={search} exportFilename="bundles" />

      {/* Create Bundle Dialog */}
      <Dialog open={createDialog} onOpenChange={(open) => { setCreateDialog(open); if (!open) setFormErrors({}); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Bundle</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Select value={newBundle.name} onValueChange={(val) => setNewBundle({ ...newBundle, name: val })}>
                <SelectTrigger><SelectValue placeholder="Select name" /></SelectTrigger>
                <SelectContent>
                  {BUNDLE_NAMES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
              {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={newBundle.type} onValueChange={(val) => setNewBundle({ ...newBundle, type: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BUNDLE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" min={0} step="0.01" value={newBundle.price} onChange={(e) => setNewBundle({ ...newBundle, price: Number(e.target.value) })} />
                {formErrors.price && <p className="text-sm text-destructive">{formErrors.price}</p>}
              </div>
              <div className="space-y-2">
                <Label>Consultations</Label>
                <Input type="number" min={1} step={1} value={newBundle.consultationCount} onChange={(e) => setNewBundle({ ...newBundle, consultationCount: Number(e.target.value) })} />
                {formErrors.consultationCount && <p className="text-sm text-destructive">{formErrors.consultationCount}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={newBundle.currency} onValueChange={(val) => setNewBundle({ ...newBundle, currency: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Recurring Type</Label>
                <Select value={newBundle.recurringType} onValueChange={(val) => setNewBundle({ ...newBundle, recurringType: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RECURRING_TYPES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={newBundle.description} onChange={(e) => setNewBundle({ ...newBundle, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createBundle.isPending}>
              {createBundle.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Bundle"
        description="Are you sure you want to delete this bundle? This action cannot be undone."
        variant="destructive"
        confirmLabel="Delete"
        isLoading={deleteBundle.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
