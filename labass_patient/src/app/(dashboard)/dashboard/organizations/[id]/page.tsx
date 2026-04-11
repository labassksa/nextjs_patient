"use client";

import { useParams, useRouter } from "next/navigation";
import { useOrganizations, useUpdateOrganization, useOrgConsultationsReport } from "@/features/dashboard/hooks/use-organizations";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { StatusBadge } from "@/features/dashboard/components/shared/status-badge";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { FormSkeleton } from "@/features/dashboard/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Plus, Eye, Building2, MapPin, GitBranch, Banknote, Calendar, Phone, User, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const ORG_TYPES = ["pharmacy", "laboratory", "home care", "school"] as const;
const DEAL_TYPES = ["SUBSCRIPTION", "REVENUE_SHARE"] as const;
const KSA_CITIES = [
  "Riyadh", "Jeddah", "Mecca", "Medina", "Dammam",
  "Khobar", "Dhahran", "Tabuk", "Abha", "Taif",
  "Buraidah", "Khamis Mushait", "Hail", "Najran", "Jubail",
  "Yanbu", "Al Ahsa", "Jazan", "Al Baha", "Arar",
  "Sakaka", "Qatif", "Unaizah", "Hafar Al Batin",
] as const;

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = Number(params.id);
  const { data: orgs, isLoading, error, refetch } = useOrganizations();
  const updateOrg = useUpdateOrganization();
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  const [fromDate, setFromDate] = useState(weekAgo.toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(today.toISOString().split("T")[0]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: reportData, isLoading: consultationsLoading } = useOrgConsultationsReport(orgId, fromDate, toDate, page, limit);

  const handleExportConsultations = async () => {
    const XLSX = await import("xlsx");
    const rows = (reportData?.consultations ?? []).map((c) => ({
      ID: c.id,
      Status: c.status,
      Patient: `${c.patient?.firstName ?? ""} ${c.patient?.lastName ?? ""}`.trim(),
      Marketer: `${c.marketer?.firstName ?? ""} ${c.marketer?.lastName ?? ""}`.trim(),
      Doctor: `${c.doctor?.firstName ?? ""} ${c.doctor?.lastName ?? ""}`.trim(),
      Created: new Date(c.createdAt).toLocaleDateString(),
      Closed: c.closedAt ? new Date(c.closedAt).toLocaleDateString() : "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Consultations");
    XLSX.writeFile(wb, `consultations-org-${orgId}.xlsx`);
  };

  const org = Array.isArray(orgs) ? orgs.find((o) => o.id === orgId) : undefined;

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    dealType: "",
    city: "",
    numberOfBranches: 1,
    iban: "",
    phoneNumber: "",
    organizationManagerName: "",
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (org) {
      setFormData({
        name: org.name || "",
        type: org.type || "",
        dealType: org.dealType || "",
        city: org.city || "",
        numberOfBranches: org.numberOfBranches || 1,
        iban: org.iban || "",
        phoneNumber: org.phoneNumber || "",
        organizationManagerName: org.organizationManagerName || "",
      });
    }
  }, [org]);

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setEditErrors({});
  };

  const handleSave = async () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.type) errors.type = "Type is required";
    if (!formData.dealType) errors.dealType = "Deal type is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.numberOfBranches || formData.numberOfBranches < 1) errors.numberOfBranches = "Must have at least 1 branch";
    if (formData.iban && !/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(formData.iban)) errors.iban = "Invalid IBAN format (e.g. SA...)";
    if (formData.phoneNumber && !/^\+\d{1,3}\d{7,14}$/.test(formData.phoneNumber)) errors.phoneNumber = "Invalid phone (e.g. +966XXXXXXXXX)";
    if (Object.keys(errors).length > 0) { setEditErrors(errors); setSaveSuccess(false); return; }
    setEditErrors({});
    setSaveSuccess(false);
    await updateOrg.mutateAsync({
      organizationId: orgId,
      name: formData.name,
      type: formData.type,
      dealType: formData.dealType,
      city: formData.city,
      numberOfBranches: formData.numberOfBranches,
      iban: formData.iban,
      phoneNumber: formData.phoneNumber,
      organizationManagerName: formData.organizationManagerName,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    refetch();
  };

  if (isLoading) return <FormSkeleton fields={4} />;
  if (error) return <ErrorState onRetry={() => refetch()} />;
  if (!org) return <ErrorState title="Not found" message="Organization not found" />;

  const consultationsList = reportData?.consultations ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={org.name}
        description={`${org.type} - ${org.city}`}
        actions={<StatusBadge status={org.dealType} />}
      />

      {/* Organization Details */}
      <Card>
        <CardHeader><CardTitle>Organization Details</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{org.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p className="font-medium">{org.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Branches</p>
                <p className="font-medium">{org.numberOfBranches}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Deal Type</p>
                <Badge variant="outline">{org.dealType}</Badge>
              </div>
            </div>
            {org.organizationManagerName && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-custom-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Manager</p>
                  <p className="font-medium">{org.organizationManagerName}</p>
                </div>
              </div>
            )}
            {org.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-custom-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium font-mono text-sm" dir="ltr">{org.phoneNumber}</p>
                </div>
              </div>
            )}
            {org.iban && (
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-custom-green" />
                <div>
                  <p className="text-sm text-muted-foreground">IBAN</p>
                  <p className="font-medium font-mono text-sm" dir="ltr">{org.iban}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{new Date(org.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Organization */}
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Edit Organization</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Organization Name</Label>
            <Input value={formData.name} onChange={(e) => updateField("name", e.target.value)} />
            {editErrors.name && <p className="text-sm text-destructive">{editErrors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(val) => updateField("type", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ORG_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editErrors.type && <p className="text-sm text-destructive">{editErrors.type}</p>}
            </div>
            <div className="space-y-2">
              <Label>Deal Type</Label>
              <Select value={formData.dealType} onValueChange={(val) => updateField("dealType", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select deal type" />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_TYPES.map((d) => (
                    <SelectItem key={d} value={d}>{d.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editErrors.dealType && <p className="text-sm text-destructive">{editErrors.dealType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Select value={formData.city} onValueChange={(val) => updateField("city", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {KSA_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editErrors.city && <p className="text-sm text-destructive">{editErrors.city}</p>}
            </div>
            <div className="space-y-2">
              <Label>Number of Branches</Label>
              <Input
                type="number"
                min={1}
                value={formData.numberOfBranches}
                onChange={(e) => updateField("numberOfBranches", Number(e.target.value) || 0)}
              />
              {editErrors.numberOfBranches && <p className="text-sm text-destructive">{editErrors.numberOfBranches}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Manager Name</Label>
            <Input
              value={formData.organizationManagerName}
              onChange={(e) => updateField("organizationManagerName", e.target.value)}
              placeholder="Organization manager name"
            />
          </div>

          <div className="space-y-2">
            <Label>Manager Phone Number</Label>
            <Input
              value={formData.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              placeholder="+966XXXXXXXXX"
              dir="ltr"
            />
            {editErrors.phoneNumber && <p className="text-sm text-destructive">{editErrors.phoneNumber}</p>}
          </div>

          <div className="space-y-2">
            <Label>IBAN</Label>
            <Input
              value={formData.iban}
              onChange={(e) => updateField("iban", e.target.value)}
              placeholder="SA..."
              dir="ltr"
            />
            {editErrors.iban && <p className="text-sm text-destructive">{editErrors.iban}</p>}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} disabled={updateOrg.isPending}>
              {updateOrg.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            {saveSuccess && <p className="text-sm text-green-600 font-medium">Changes saved successfully.</p>}
            {updateOrg.isError && <p className="text-sm text-destructive font-medium">Failed to save changes. Please try again.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Marketers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Marketers ({org.marketers?.length || 0})</CardTitle>
          <Button
            size="sm"
            onClick={() => router.push(`/dashboard/marketers/new?organizationId=${orgId}`)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Marketer
          </Button>
        </CardHeader>
        <CardContent>
          {org.marketers?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead>Promo Codes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {org.marketers.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.id}</TableCell>
                    <TableCell>
                      {m.user?.firstName ?? m.firstName} {m.user?.lastName ?? m.lastName}
                    </TableCell>
                    <TableCell dir="ltr">{m.user?.phoneNumber ?? m.phoneNumber}</TableCell>
                    <TableCell>{m.user?.email ?? m.email}</TableCell>
                    <TableCell>{m.nationality}</TableCell>
                    <TableCell>{m.promoCodes?.length || 0}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/marketers/${m.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No marketers yet. Click &quot;Add Marketer&quot; to create one.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Consultations */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>
            Consultations{" "}
            <Badge variant="secondary" className="ml-2 font-mono">{reportData?.total ?? consultationsList.length}</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">From</Label>
              <Input type="date" lang="en" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} className="h-8 w-auto text-sm" dir="ltr" max={toDate} />
            </div>
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">To</Label>
              <Input type="date" lang="en" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} className="h-8 w-auto text-sm" dir="ltr" min={fromDate} max={today.toISOString().split("T")[0]} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-3">
            <Button variant="outline" size="sm" onClick={handleExportConsultations} disabled={consultationsList.length === 0 || consultationsLoading}>
              <Download className="h-4 w-4 mr-2" /> Export to Excel
            </Button>
          </div>
          {consultationsLoading ? (
            <p className="text-sm text-muted-foreground text-center py-6">Loading consultations...</p>
          ) : consultationsList.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Marketer</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Closed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultationsList.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs">#{c.id}</TableCell>
                      <TableCell><StatusBadge status={c.status} /></TableCell>
                      <TableCell>{c.patient?.firstName} {c.patient?.lastName}</TableCell>
                      <TableCell>{c.marketer?.firstName} {c.marketer?.lastName}</TableCell>
                      <TableCell>{c.doctor?.firstName} {c.doctor?.lastName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.closedAt ? new Date(c.closedAt).toLocaleDateString() : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No consultations found for this date range.
            </p>
          )}

          {/* Pagination */}
          {consultationsList.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">{(page - 1) * limit + 1}</span>
                  {" "}to{" "}
                  <span className="font-medium text-foreground">{Math.min(page * limit, reportData?.total ?? consultationsList.length)}</span>
                  {" "}of{" "}
                  <span className="font-medium text-foreground">{reportData?.total ?? consultationsList.length}</span>
                  {" "}results
                </p>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rows per page</span>
                  <Select value={String(limit)} onValueChange={(val) => { setLimit(Number(val)); setPage(1); }}>
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 30, 50].map((size) => (
                        <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground mr-2">
                  Page {page} of {Math.ceil((reportData?.total ?? consultationsList.length) / limit) || 1}
                </span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(1)} disabled={page === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil((reportData?.total ?? consultationsList.length) / limit)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(Math.ceil((reportData?.total ?? consultationsList.length) / limit))} disabled={page >= Math.ceil((reportData?.total ?? consultationsList.length) / limit)}>
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
