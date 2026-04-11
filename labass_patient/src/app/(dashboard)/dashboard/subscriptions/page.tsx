"use client";

import { useState, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useSubscriptions, useCreateSubscription, useToggleSubscriptionStatus, useCancelSubscription } from "@/features/dashboard/hooks/use-subscriptions";
import type { Subscription } from "@/features/dashboard/types/subscription.types";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Ban } from "lucide-react";

export default function SubscriptionsPage() {
  const { data, isLoading, error, refetch } = useSubscriptions();
  const createSub = useCreateSubscription();
  const toggleStatus = useToggleSubscriptionStatus();
  const cancelSub = useCancelSubscription();
  const [search, setSearch] = useState("");
  const [createDialog, setCreateDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [newSub, setNewSub] = useState({ organizationId: 0, bundleId: 0 });
  const [subErrors, setSubErrors] = useState<Record<string, string>>({});

  const handleSearch = useCallback((value: string) => setSearch(value), []);

  const handleCreate = async () => {
    const errors: Record<string, string> = {};
    if (!newSub.organizationId || newSub.organizationId < 1) errors.organizationId = "Organization ID is required";
    if (!newSub.bundleId || newSub.bundleId < 1) errors.bundleId = "Bundle ID is required";
    if (Object.keys(errors).length > 0) { setSubErrors(errors); return; }
    setSubErrors({});
    await createSub.mutateAsync(newSub);
    setCreateDialog(false);
    setNewSub({ organizationId: 0, bundleId: 0 });
  };

  const handleCancel = async () => {
    if (cancelDialog.id) {
      await cancelSub.mutateAsync(cancelDialog.id);
    }
    setCancelDialog({ open: false, id: null });
  };

  const columns: ColumnDef<Subscription>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: "organizationName",
      header: "Organization",
      cell: ({ row }) => <span className="font-medium">{row.original.organizationName}</span>,
    },
    {
      accessorKey: "bundleName",
      header: "Bundle",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">{row.original.bundleName}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "remainingConsultations",
      header: "Remaining",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          <span className="font-medium">{row.original.remainingConsultations}</span>
          <span className="text-muted-foreground"> / {row.original.totalConsultations}</span>
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">{row.original.price} <span className="text-muted-foreground">SAR</span></span>
      ),
    },
    {
      accessorKey: "nextBillingDate",
      header: "Next Billing",
      cell: ({ row }) => {
        const date = row.getValue("nextBillingDate") as string;
        return date ? (
          <span className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString()}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      id: "toggle",
      header: "Toggle",
      cell: ({ row }) => (
        <Switch
          checked={row.original.status?.toLowerCase() === "active"}
          onCheckedChange={() => toggleStatus.mutate(row.original.id)}
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
          onClick={() => setCancelDialog({ open: true, id: row.original.id })}
        >
          <Ban className="h-4 w-4 mr-1" /> Cancel
        </Button>
      ),
    },
  ];

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const subscriptions = Array.isArray(data) ? data : [];

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        description="Manage organization subscriptions"
        actions={
          <Button onClick={() => setCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Subscription
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput placeholder="Search subscriptions..." onChange={handleSearch} className="max-w-sm" />
      </div>

      <DataTable columns={columns} data={subscriptions} isLoading={isLoading} searchKey="organizationName" searchValue={search} exportFilename="subscriptions" />

      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Subscription</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Organization ID</Label>
              <Input type="number" min={1} value={newSub.organizationId || ""} onChange={(e) => { setNewSub({ ...newSub, organizationId: Number(e.target.value) }); setSubErrors({}); }} />
              {subErrors.organizationId && <p className="text-sm text-destructive">{subErrors.organizationId}</p>}
            </div>
            <div className="space-y-2">
              <Label>Bundle ID</Label>
              <Input type="number" min={1} value={newSub.bundleId || ""} onChange={(e) => { setNewSub({ ...newSub, bundleId: Number(e.target.value) }); setSubErrors({}); }} />
              {subErrors.bundleId && <p className="text-sm text-destructive">{subErrors.bundleId}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createSub.isPending}>
              {createSub.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={cancelDialog.open}
        onOpenChange={(open) => setCancelDialog({ ...cancelDialog, open })}
        title="Cancel Subscription"
        description="Are you sure you want to cancel this subscription?"
        variant="destructive"
        confirmLabel="Cancel Subscription"
        isLoading={cancelSub.isPending}
        onConfirm={handleCancel}
      />
    </div>
  );
}
