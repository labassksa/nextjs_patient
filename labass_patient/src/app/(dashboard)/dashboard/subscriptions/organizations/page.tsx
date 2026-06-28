"use client";

import { useState, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useSubscriptions, useCreateSubscription, useToggleSubscriptionStatus, useCancelSubscription } from "@/features/dashboard/hooks/use-subscriptions";
import { useBundles, useCreateBundle, useToggleBundleActive, useDeleteBundle } from "@/features/dashboard/hooks/use-bundles";
import type { Subscription } from "@/features/dashboard/types/subscription.types";
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
import { Plus, Ban, Trash2 } from "lucide-react";

const CURRENCIES = ["SAR", "KWD", "AED", "BHD", "OMR", "QAR", "USD", "EUR"] as const;
const RECURRING_TYPES = ["Daily", "Weekly", "Monthly", "Custom"] as const;
const BUNDLE_TYPES = ["GP Consultations", "Specialist Consultations", "Vitamins"] as const;
const BUNDLE_NAMES = ["basic", "standard", "premium"] as const;

const DEFAULT_BUNDLE: CreateBundlePayload = {
  name: "basic", type: "GP Consultations", price: 0, consultationCount: 0,
  currency: "SAR", recurringType: "Monthly", intervalDays: undefined, description: "",
  originalPrice: undefined, whoSubscribes: "organization", isUnlimited: false,
};

export default function OrganizationsSubscriptionsPage() {
  const { data: subsData, isLoading: subsLoading, error: subsError, refetch: subsRefetch } = useSubscriptions();
  const { data: bundlesData, isLoading: bundlesLoading, error: bundlesError, refetch: bundlesRefetch } = useBundles();
  const createSub = useCreateSubscription();
  const toggleStatus = useToggleSubscriptionStatus();
  const cancelSub = useCancelSubscription();
  const createBundle = useCreateBundle();
  const toggleActive = useToggleBundleActive();
  const deleteBundle = useDeleteBundle();

  const [subSearch, setSubSearch] = useState("");
  const [createSubDialog, setCreateSubDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [newSub, setNewSub] = useState({ organizationId: 0, bundleId: 0 });
  const [subErrors, setSubErrors] = useState<Record<string, string>>({});

  const [bundleSearch, setBundleSearch] = useState("");
  const [createBundleDialog, setCreateBundleDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [newBundle, setNewBundle] = useState<CreateBundlePayload>(DEFAULT_BUNDLE);
  const [bundleErrors, setBundleErrors] = useState<Record<string, string>>({});

  const handleCreateSub = async () => {
    const errors: Record<string, string> = {};
    if (!newSub.organizationId || newSub.organizationId < 1) errors.organizationId = "Organization ID is required";
    if (!newSub.bundleId || newSub.bundleId < 1) errors.bundleId = "Bundle ID is required";
    if (Object.keys(errors).length > 0) { setSubErrors(errors); return; }
    setSubErrors({});
    await createSub.mutateAsync(newSub);
    setCreateSubDialog(false);
    setNewSub({ organizationId: 0, bundleId: 0 });
  };

  const handleCancel = async () => {
    if (cancelDialog.id) await cancelSub.mutateAsync(cancelDialog.id);
    setCancelDialog({ open: false, id: null });
  };

  const validateBundle = (): boolean => {
    const errors: Record<string, string> = {};
    if (!newBundle.name) errors.name = "Please select a name";
    if (!newBundle.consultationCount || newBundle.consultationCount < 1 || !Number.isInteger(newBundle.consultationCount))
      errors.consultationCount = "Must be a positive integer";
    if (newBundle.price < 0) errors.price = "Price must be non-negative";
    if (newBundle.recurringType === "Custom" && (!newBundle.intervalDays || newBundle.intervalDays < 1))
      errors.intervalDays = "Required for Custom recurring type";
    setBundleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateBundle = async () => {
    if (!validateBundle()) return;
    await createBundle.mutateAsync({ ...newBundle, whoSubscribes: "organization", isUnlimited: false });
    setCreateBundleDialog(false);
    setNewBundle(DEFAULT_BUNDLE);
    setBundleErrors({});
  };

  const handleDeleteBundle = async () => {
    if (deleteDialog.id) await deleteBundle.mutateAsync(deleteDialog.id);
    setDeleteDialog({ open: false, id: null });
  };

  const subColumns: ColumnDef<Subscription>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span className="text-xs font-mono text-muted-foreground">#{row.original.id}</span>,
    },
    {
      accessorKey: "organization",
      header: "Organization",
      cell: ({ row }) => <span className="font-medium">{row.original.organization?.name}</span>,
    },
    {
      accessorKey: "bundle",
      header: "Bundle",
      cell: ({ row }) => <Badge variant="outline" className="font-normal capitalize">{row.original.bundle?.name}</Badge>,
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
        <span className="font-mono text-sm font-medium">
          {row.original.price} <span className="text-muted-foreground">SAR</span>
        </span>
      ),
    },
    {
      accessorKey: "nextBillingDate",
      header: "Next Billing",
      cell: ({ row }) => {
        const date = row.getValue("nextBillingDate") as string;
        return date
          ? <span className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString()}</span>
          : <span className="text-muted-foreground">—</span>;
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
          variant="ghost" size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => setCancelDialog({ open: true, id: row.original.id })}
        >
          <Ban className="h-4 w-4 mr-1" /> Cancel
        </Button>
      ),
    },
  ];

  const bundleColumns: ColumnDef<Bundle>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span className="text-xs font-mono text-muted-foreground">#{row.original.id}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <Badge variant="outline" className="font-normal capitalize">{row.original.type}</Badge>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-mono text-sm font-medium">
            {row.original.price} <span className="text-muted-foreground">{row.original.currency || "SAR"}</span>
          </span>
          {row.original.originalPrice && (
            <span className="font-mono text-xs text-muted-foreground line-through">
              {row.original.originalPrice} {row.original.currency || "SAR"}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "consultationCount",
      header: "Consultations",
      cell: ({ row }) => <Badge variant="secondary" className="font-mono">{row.original.consultationCount}</Badge>,
    },
    {
      accessorKey: "recurringType",
      header: "Recurring",
      cell: ({ row }) => <Badge variant="outline" className="font-normal">{row.original.recurringType}</Badge>,
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => (
        <Switch checked={row.original.isActive} onCheckedChange={() => toggleActive.mutate(row.original.id)} />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost" size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => setDeleteDialog({ open: true, id: row.original.id })}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (subsError) return <ErrorState onRetry={() => subsRefetch()} />;
  if (bundlesError) return <ErrorState onRetry={() => bundlesRefetch()} />;

  const allSubs = Array.isArray(subsData) ? subsData : [];
  const orgSubs = allSubs.filter((s) => s.bundle?.whoSubscribes === "organization");

  const active   = (bundlesData?.active   ?? []).filter((b) => b.whoSubscribes === "organization");
  const inactive = (bundlesData?.inactive ?? []).filter((b) => b.whoSubscribes === "organization");

  return (
    <div className="space-y-10">
      <PageHeader title="Organizations Subscriptions" description="Manage subscriptions and bundles for organizations" />

      {/* Subscriptions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Subscriptions</h2>
            <p className="text-sm text-muted-foreground">View and manage organization subscriptions</p>
          </div>
          <Button onClick={() => setCreateSubDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Subscription
          </Button>
        </div>
        <div className="mb-4">
          <SearchInput placeholder="Search subscriptions..." onChange={useCallback((v: string) => setSubSearch(v), [])} className="max-w-sm" />
        </div>
        <DataTable columns={subColumns} data={orgSubs} isLoading={subsLoading} searchKey="organization" searchValue={subSearch} exportFilename="org-subscriptions" />
      </div>

      {/* Bundles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Organization Bundles</h2>
            <p className="text-sm text-muted-foreground">Manage subscription bundles for organizations</p>
          </div>
          <Button onClick={() => setCreateBundleDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Bundle
          </Button>
        </div>
        <div className="mb-4">
          <SearchInput placeholder="Search bundles..." onChange={useCallback((v: string) => setBundleSearch(v), [])} className="max-w-sm" />
        </div>
        <DataTable columns={bundleColumns} data={active} isLoading={bundlesLoading} searchKey="name" searchValue={bundleSearch} exportFilename="organization-bundles" />
        {inactive.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Inactive Bundles</h3>
            <DataTable columns={bundleColumns} data={inactive} isLoading={false} searchKey="name" searchValue={bundleSearch} exportFilename="organization-bundles-inactive" />
          </div>
        )}
      </div>

      {/* Create Subscription Dialog */}
      <Dialog open={createSubDialog} onOpenChange={setCreateSubDialog}>
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
            <Button variant="outline" onClick={() => setCreateSubDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateSub} disabled={createSub.isPending}>
              {createSub.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription */}
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

      {/* Create Bundle Dialog */}
      <Dialog open={createBundleDialog} onOpenChange={(open) => { setCreateBundleDialog(open); if (!open) setBundleErrors({}); }}>
        <DialogContent className="flex flex-col max-h-[85vh]">
          <DialogHeader><DialogTitle>Create Organization Bundle</DialogTitle></DialogHeader>
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            <div className="space-y-2">
              <Label>Name</Label>
              <Select value={newBundle.name} onValueChange={(val) => setNewBundle({ ...newBundle, name: val })}>
                <SelectTrigger><SelectValue placeholder="Select name" /></SelectTrigger>
                <SelectContent>{BUNDLE_NAMES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
              </Select>
              {bundleErrors.name && <p className="text-sm text-destructive">{bundleErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={newBundle.type} onValueChange={(val) => setNewBundle({ ...newBundle, type: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{BUNDLE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subscriber Type</Label>
              <Input value="Organization" disabled className="bg-muted text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" min={0} step="0.01" value={newBundle.price} onChange={(e) => setNewBundle({ ...newBundle, price: Number(e.target.value) })} />
                {bundleErrors.price && <p className="text-sm text-destructive">{bundleErrors.price}</p>}
              </div>
              <div className="space-y-2">
                <Label>Original Price <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input type="number" min={0} step="0.01" placeholder="e.g. 600" value={newBundle.originalPrice ?? ""} onChange={(e) => setNewBundle({ ...newBundle, originalPrice: e.target.value ? Number(e.target.value) : undefined })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Consultations</Label>
              <Input type="number" min={1} step={1} value={newBundle.consultationCount} onChange={(e) => setNewBundle({ ...newBundle, consultationCount: Number(e.target.value) })} />
              {bundleErrors.consultationCount && <p className="text-sm text-destructive">{bundleErrors.consultationCount}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={newBundle.currency} onValueChange={(val) => setNewBundle({ ...newBundle, currency: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Recurring Type</Label>
                <Select value={newBundle.recurringType} onValueChange={(val) => setNewBundle({ ...newBundle, recurringType: val, intervalDays: undefined })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{RECURRING_TYPES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            {newBundle.recurringType === "Custom" && (
              <div className="space-y-2">
                <Label>Interval Days</Label>
                <Input type="number" min={1} step={1} placeholder="e.g. 30 for monthly, 90 for quarterly" value={newBundle.intervalDays ?? ""} onChange={(e) => setNewBundle({ ...newBundle, intervalDays: e.target.value ? Number(e.target.value) : undefined })} />
                {bundleErrors.intervalDays && <p className="text-sm text-destructive">{bundleErrors.intervalDays}</p>}
              </div>
            )}
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={newBundle.description} onChange={(e) => setNewBundle({ ...newBundle, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateBundleDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateBundle} disabled={createBundle.isPending}>
              {createBundle.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Bundle */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Bundle"
        description="Are you sure you want to delete this bundle? This action cannot be undone."
        variant="destructive"
        confirmLabel="Delete"
        isLoading={deleteBundle.isPending}
        onConfirm={handleDeleteBundle}
      />
    </div>
  );
}
