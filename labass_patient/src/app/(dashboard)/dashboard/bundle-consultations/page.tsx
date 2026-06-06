"use client";

import { useState, useMemo } from "react";
import { useOrganizations } from "@/features/dashboard/hooks/use-organizations";
import { useOrgSubscriptionConsultations } from "@/features/dashboard/hooks/use-organizations";
import { useSubscriptions } from "@/features/dashboard/hooks/use-subscriptions";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { StatusBadge } from "@/features/dashboard/components/shared/status-badge";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const BUNDLE_TYPES = [
  { value: "ALL", label: "All Bundle Types" },
  { value: "GP_CONSULTATIONS", label: "GP Consultations" },
  { value: "SPECIALIST_CONSULTATIONS", label: "Specialist Consultations" },
];

export default function BundleConsultationsPage() {
  const today = new Date().toISOString().split("T")[0];
  const monthStart = new Date(new Date().setDate(1)).toISOString().split("T")[0];

  const [orgId, setOrgId] = useState<number | null>(null);
  const [bundleType, setBundleType] = useState("ALL");
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState(monthStart);
  const [toDate, setToDate] = useState(today);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data: organizations, isLoading: orgsLoading } = useOrganizations();
  const { data: allSubscriptions } = useSubscriptions();

  const orgSubscriptions = useMemo(() => {
    if (!allSubscriptions || !orgId) return [];
    return (Array.isArray(allSubscriptions) ? allSubscriptions : []).filter(
      (s: any) => s.organization?.id === orgId
    );
  }, [allSubscriptions, orgId]);

  const { data, isLoading, error, refetch } = useOrgSubscriptionConsultations(
    orgId ?? 0,
    {
      bundleType: bundleType !== "ALL" ? bundleType : undefined,
      subscriptionId: subscriptionId ?? undefined,
      fromDate,
      toDate,
      page,
      limit,
    }
  );

  const handleOrgChange = (value: string) => {
    setOrgId(Number(value));
    setSubscriptionId(null);
    setPage(1);
  };

  const handleBundleTypeChange = (value: string) => {
    setBundleType(value);
    setSubscriptionId(null);
    setPage(1);
  };

  const handleSubscriptionChange = (value: string) => {
    setSubscriptionId(value === "ALL" ? null : Number(value));
    setPage(1);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
    setPage(1);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
    setPage(1);
  };

  const handleExport = async () => {
    const XLSX = await import("xlsx");
    const rows = (data?.consultations ?? []).map((c) => ({
      "Consultation ID": c.id,
      Type: c.type,
      Status: c.status,
      "Bundle Type": c.subscription?.bundle?.type ?? "",
      "Subscription ID": c.subscription?.id ?? "",
      "Remaining / Total": `${c.subscription?.remainingConsultations} / ${c.subscription?.totalConsultations}`,
      "Patient Name": c.patient?.user?.firstName ?? "",
      "Patient Phone": c.patient?.user?.phoneNumber ?? "",
      "Doctor Name": `${c.doctor?.user?.firstName ?? ""} ${c.doctor?.user?.lastName ?? ""}`.trim(),
      Created: new Date(c.createdAt).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bundle Consultations");
    XLSX.writeFile(wb, `bundle-consultations-org${orgId}.xlsx`);
  };

  const consultations = data?.consultations ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const orgList = Array.isArray(organizations) ? organizations : [];

  return (
    <div>
      <PageHeader
        title="Bundle Consultations"
        description="View consultations created through organization subscription bundles"
      />

      {/* Filters */}
      <Card className="mb-4">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Organization selector */}
            <div className="space-y-1 min-w-[200px]">
              <Label className="text-xs text-muted-foreground">Organization</Label>
              <Select onValueChange={handleOrgChange} disabled={orgsLoading}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={orgsLoading ? "Loading..." : "Select organization"} />
                </SelectTrigger>
                <SelectContent>
                  {orgList.map((org) => (
                    <SelectItem key={org.id} value={String(org.id)}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bundle type filter */}
            <div className="space-y-1 min-w-[180px]">
              <Label className="text-xs text-muted-foreground">Bundle Type</Label>
              <Select value={bundleType} onValueChange={handleBundleTypeChange} disabled={!orgId}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUNDLE_TYPES.map((bt) => (
                    <SelectItem key={bt.value} value={bt.value}>
                      {bt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subscription selector */}
            <div className="space-y-1 min-w-[220px]">
              <Label className="text-xs text-muted-foreground">Subscription</Label>
              <Select
                value={subscriptionId ? String(subscriptionId) : "ALL"}
                onValueChange={handleSubscriptionChange}
                disabled={!orgId}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All subscriptions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All subscriptions</SelectItem>
                  {orgSubscriptions.map((s: any) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      #{s.id} — {s.bundle?.type ?? "Unknown"} ({new Date(s.createdAt).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date range */}
            <div className="flex items-end gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">From</Label>
                <Input
                  type="date"
                  lang="en"
                  dir="ltr"
                  value={fromDate}
                  max={toDate}
                  onChange={handleFromDateChange}
                  className="h-9 w-auto text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">To</Label>
                <Input
                  type="date"
                  lang="en"
                  dir="ltr"
                  value={toDate}
                  min={fromDate}
                  max={today}
                  onChange={handleToDateChange}
                  className="h-9 w-auto text-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 py-3">
          <CardTitle className="text-base">
            Consultations{" "}
            {orgId && (
              <Badge variant="secondary" className="ml-2 font-mono">{total}</Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!orgId || consultations.length === 0 || isLoading}
          >
            <Download className="h-4 w-4 mr-2" /> Export to Excel
          </Button>
        </CardHeader>
        <CardContent>
          {!orgId ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              Select an organization to view its bundle consultations.
            </p>
          ) : error ? (
            <ErrorState onRetry={() => refetch()} />
          ) : isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-10">Loading consultations...</p>
          ) : consultations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              No bundle consultations found for the selected filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bundle Type</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Remaining / Total</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultations.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs">#{c.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{c.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={c.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.subscription?.bundle?.type ?? "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.subscription?.id ? `#${c.subscription.id}` : "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.subscription
                          ? `${c.subscription.remainingConsultations} / ${c.subscription.totalConsultations}`
                          : "—"}
                      </TableCell>
                      <TableCell>{c.patient?.user?.firstName ?? "—"}</TableCell>
                      <TableCell className="font-mono text-xs" dir="ltr">
                        {c.patient?.user?.phoneNumber ?? "—"}
                      </TableCell>
                      <TableCell>
                        {[c.doctor?.user?.firstName, c.doctor?.user?.lastName]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {orgId && consultations.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">{(page - 1) * limit + 1}</span>
                  {" "}to{" "}
                  <span className="font-medium text-foreground">{Math.min(page * limit, total)}</span>
                  {" "}of{" "}
                  <span className="font-medium text-foreground">{total}</span>
                  {" "}results
                </p>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rows per page</span>
                  <Select value={String(limit)} onValueChange={(val) => { setLimit(Number(val)); setPage(1); }}>
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[20, 50, 100].map((size) => (
                        <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground mr-2">
                  Page {page} of {totalPages}
                </span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(1)} disabled={page === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => p + 1)} disabled={!data?.hasNextPage}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(totalPages)} disabled={!data?.hasNextPage}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
