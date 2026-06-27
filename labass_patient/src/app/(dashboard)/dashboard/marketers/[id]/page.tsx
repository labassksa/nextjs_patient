"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useMarketers, useUpdateMarketer, useSendMessageToMarketer, useSendPromoCodesToMarketer, useMarketerConsultations } from "@/features/dashboard/hooks/use-marketers";
import { useGeneratePromoCode, useTogglePromoCode, useResetMarketerPromoUsage } from "@/features/dashboard/hooks/use-promo-codes";
import { useReferralReport } from "@/features/dashboard/hooks/use-subscriptions";
import { getReferralReport } from "@/features/dashboard/api/subscriptions.api";
import { getMarketerConsultations } from "@/features/dashboard/api/marketers.api";
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
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, RefreshCw, Plus, Building2, User, Phone, Mail, Calendar, CreditCard, Globe, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download } from "lucide-react";
import Link from "next/link";

export default function MarketerDetailPage() {
  const params = useParams();
  const marketerId = Number(params.id);
  const { data: marketers, isLoading, error, refetch } = useMarketers();
  const updateMarketer = useUpdateMarketer();
  const sendMessage = useSendMessageToMarketer();
  const sendPromoCodes = useSendPromoCodesToMarketer();
  const generatePromo = useGeneratePromoCode();
  const togglePromo = useTogglePromoCode();
  const resetUsage = useResetMarketerPromoUsage();

  const marketer = Array.isArray(marketers) ? marketers.find((m) => m.id === marketerId) : undefined;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    nationalId: "",
    dateOfBirth: "",
    iban: "",
    nationality: "",
  });
  const [messageDialog, setMessageDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [generateDialog, setGenerateDialog] = useState(false);
  const [promoConfig, setPromoConfig] = useState({ discountPercentage: 10, marketerPercentage: 10, numberOfCodes: 5 });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [promoErrors, setPromoErrors] = useState<Record<string, string>>({});

  const todayDate = new Date();
  const weekAgoDate = new Date(todayDate);
  weekAgoDate.setDate(todayDate.getDate() - 7);
  const [consultFromDate, setConsultFromDate] = useState(weekAgoDate.toISOString().split("T")[0]);
  const [consultToDate, setConsultToDate] = useState(todayDate.toISOString().split("T")[0]);

  useEffect(() => {
    if (marketer) {
      setFormData({
        firstName: marketer.user?.firstName ?? marketer.firstName ?? "",
        lastName: marketer.user?.lastName ?? marketer.lastName ?? "",
        email: marketer.user?.email ?? marketer.email ?? "",
        phoneNumber: marketer.user?.phoneNumber ?? marketer.phoneNumber ?? "",
        gender: marketer.gender ?? "",
        nationalId: marketer.nationalId ?? "",
        dateOfBirth: marketer.dateOfBirth ? marketer.dateOfBirth.split("T")[0] : "",
        iban: marketer.iban ?? "",
        nationality: marketer.nationality ?? "",
      });
    }
  }, [marketer]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setEditErrors({});
  };

  const marketerUserId = marketer?.userId ?? 0;
  const { data: consultData, isLoading: consultLoading } = useMarketerConsultations(marketerUserId, consultFromDate, consultToDate);
  const consultationsList = consultData?.consultations ?? [];

  const [refPage, setRefPage] = useState(1);
  const refLimit = 10;
  const { data: referralData, isLoading: referralLoading } = useReferralReport({
    marketerId: marketerId,
    page: refPage,
    limit: refLimit,
  });

  const [isExportingConsult, setIsExportingConsult] = useState(false);
  const [isExportingReferral, setIsExportingReferral] = useState(false);

  const handleExportConsultations = async () => {
    const marketerName = `${marketer?.user?.firstName ?? marketer?.firstName ?? ""} ${marketer?.user?.lastName ?? marketer?.lastName ?? ""}`.trim();
    const filename = `الاستشارات الطبية - ${marketerName}`;
    const titleText = `الاستشارات الطبية للمسوّق ${marketerName} من الفترة ${consultFromDate} الي ${consultToDate}`;
    setIsExportingConsult(true);
    try {
      const ExcelJS = (await import("exceljs")).default;
      const allData = await getMarketerConsultations(marketerUserId, consultFromDate, consultToDate);
      const HEADERS = ["ID", "Status", "Patient", "Doctor", "Created", "Closed"];
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Consultations");
      worksheet.mergeCells(1, 1, 1, HEADERS.length);
      const titleCell = worksheet.getCell("A1");
      titleCell.value = titleText;
      titleCell.font = { bold: true, size: 14 };
      titleCell.alignment = { horizontal: "center", vertical: "middle", readingOrder: "rtl" };
      worksheet.getRow(1).height = 28;
      worksheet.addRow([]);
      const headerRow = worksheet.addRow(HEADERS);
      headerRow.font = { bold: true };
      headerRow.eachCell((cell) => { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0E0E0" } }; });
      for (const c of allData.consultations ?? []) {
        worksheet.addRow([
          c.id,
          c.status,
          `${c.patient?.firstName ?? ""} ${c.patient?.lastName ?? ""}`.trim(),
          `${c.doctor?.firstName ?? ""} ${c.doctor?.lastName ?? ""}`.trim(),
          new Date(c.createdAt).toLocaleDateString(),
          c.closedAt ? new Date(c.closedAt).toLocaleDateString() : "",
        ]);
      }
      HEADERS.forEach((_, i) => { worksheet.getColumn(i + 1).width = 18; });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExportingConsult(false);
    }
  };

  const handleExportReferral = async () => {
    const marketerName = `${marketer?.user?.firstName ?? marketer?.firstName ?? ""} ${marketer?.user?.lastName ?? marketer?.lastName ?? ""}`.trim();
    const filename = `اشتراكات روابط التسويق - ${marketerName}`;
    const titleText = `اشتراكات روابط التسويق للمسوّق ${marketerName}`;
    setIsExportingReferral(true);
    try {
      const ExcelJS = (await import("exceljs")).default;
      const allData = await getReferralReport({ marketerId, page: 1, limit: referralData?.total || 10000 });
      const HEADERS = ["ID", "Referral Code", "Patient", "Bundle", "Status", "Price", "Created"];
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Marketing Subscriptions");
      worksheet.mergeCells(1, 1, 1, HEADERS.length);
      const titleCell = worksheet.getCell("A1");
      titleCell.value = titleText;
      titleCell.font = { bold: true, size: 14 };
      titleCell.alignment = { horizontal: "center", vertical: "middle", readingOrder: "rtl" };
      worksheet.getRow(1).height = 28;
      worksheet.addRow([]);
      const headerRow = worksheet.addRow(HEADERS);
      headerRow.font = { bold: true };
      headerRow.eachCell((cell) => { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0E0E0" } }; });
      for (const s of allData.data ?? []) {
        worksheet.addRow([
          s.id,
          s.referralCode?.code ?? "",
          `${s.patient?.user?.firstName ?? ""} ${s.patient?.user?.lastName ?? ""}`.trim(),
          s.bundle?.name ?? "",
          s.status,
          `${s.price} ${s.currency ?? ""}`.trim(),
          new Date(s.createdAt).toLocaleDateString(),
        ]);
      }
      HEADERS.forEach((_, i) => { worksheet.getColumn(i + 1).width = 20; });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExportingReferral(false);
    }
  };

  if (isLoading) return <FormSkeleton fields={4} />;
  if (error) return <ErrorState onRetry={() => refetch()} />;
  if (!marketer) return <ErrorState title="Not found" message="Marketer not found" />;

  const handleUpdateMarketer = async () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (formData.iban && !/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(formData.iban)) errors.iban = "Invalid IBAN format";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format";
    if (Object.keys(errors).length > 0) { setEditErrors(errors); setSaveSuccess(false); return; }
    setEditErrors({});
    setSaveSuccess(false);
    await updateMarketer.mutateAsync({
      marketerId,
      marketerData: {
        iban: formData.iban,
        nationality: formData.nationality,
      },
      userData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        nationalId: formData.nationalId,
        dateOfBirth: formData.dateOfBirth,
      },
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSendMessage = async () => {
    await sendMessage.mutateAsync({ marketerId, message });
    setMessageDialog(false);
    setMessage("");
  };

  const handleGeneratePromo = async () => {
    const errors: Record<string, string> = {};
    if (!promoConfig.discountPercentage || promoConfig.discountPercentage <= 0) errors.discountPercentage = "Must be a positive number";
    if (!promoConfig.numberOfCodes || promoConfig.numberOfCodes < 1) errors.numberOfCodes = "Must be at least 1";
    if (Object.keys(errors).length > 0) { setPromoErrors(errors); return; }
    setPromoErrors({});
    await generatePromo.mutateAsync({ marketerId, ...promoConfig });
    setGenerateDialog(false);
  };

  const displayFirstName = marketer.user?.firstName ?? marketer.firstName;
  const displayLastName = marketer.user?.lastName ?? marketer.lastName;
  const displayPhone = marketer.user?.phoneNumber ?? marketer.phoneNumber;
  const displayEmail = marketer.user?.email ?? marketer.email;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${displayFirstName} ${displayLastName}`}
        description={`Marketer ID: ${marketer.id}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setMessageDialog(true)}>
              <MessageSquare className="h-4 w-4 mr-1" /> Message
            </Button>
            <Button variant="outline" size="sm" onClick={() => sendPromoCodes.mutate(marketerId)}>
              <Send className="h-4 w-4 mr-1" /> Send Codes
            </Button>
          </div>
        }
      />

      {/* Marketer Details */}
      <Card>
        <CardHeader><CardTitle>Marketer Details</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{displayFirstName} {displayLastName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium" dir="ltr">{displayPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium" dir="ltr">{displayEmail || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Organization</p>
                {marketer.organization ? (
                  <Link
                    href={`/dashboard/organizations/${marketer.organization.id}`}
                    className="font-medium text-custom-green hover:underline"
                  >
                    {marketer.organization.name}
                  </Link>
                ) : (
                  <p className="font-medium">—</p>
                )}
              </div>
            </div>
            {marketer.gender && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-custom-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{marketer.gender}</p>
                </div>
              </div>
            )}
            {marketer.dateOfBirth && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-custom-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{new Date(marketer.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            {marketer.nationalId && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-custom-green" />
                <div>
                  <p className="text-sm text-muted-foreground">National ID</p>
                  <p className="font-medium" dir="ltr">{marketer.nationalId}</p>
                </div>
              </div>
            )}
            {marketer.nationality && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-custom-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Nationality</p>
                  <p className="font-medium">{marketer.nationality}</p>
                </div>
              </div>
            )}
            {marketer.iban && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-custom-green" />
                <div>
                  <p className="text-sm text-muted-foreground">IBAN</p>
                  <p className="font-medium font-mono text-sm" dir="ltr">{marketer.iban}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{new Date(marketer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Marketer */}
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Edit Marketer</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
              {editErrors.firstName && <p className="text-sm text-destructive">{editErrors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={formData.email} onChange={(e) => updateField("email", e.target.value)} dir="ltr" placeholder="email@example.com" />
              {editErrors.email && <p className="text-sm text-destructive">{editErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={formData.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} dir="ltr" placeholder="+966..." />
              {editErrors.phoneNumber && <p className="text-sm text-destructive">{editErrors.phoneNumber}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={(val) => updateField("gender", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>National ID</Label>
              <Input value={formData.nationalId} onChange={(e) => updateField("nationalId", e.target.value)} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" value={formData.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} dir="ltr" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nationality</Label>
              <Input value={formData.nationality} onChange={(e) => updateField("nationality", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>IBAN</Label>
              <Input value={formData.iban} onChange={(e) => updateField("iban", e.target.value)} dir="ltr" placeholder="SA..." />
              {editErrors.iban && <p className="text-sm text-destructive">{editErrors.iban}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleUpdateMarketer} disabled={updateMarketer.isPending}>
              {updateMarketer.isPending ? "Saving..." : "Save Changes"}
            </Button>
            {saveSuccess && <p className="text-sm text-green-600 font-medium">Changes saved successfully.</p>}
            {updateMarketer.isError && <p className="text-sm text-destructive font-medium">Failed to save changes. Please try again.</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Promo Codes ({marketer.promoCodes?.length || 0})</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setGenerateDialog(true)}>
              <Plus className="h-4 w-4 mr-1" /> Generate
            </Button>
            <Button variant="outline" size="sm" onClick={() => resetUsage.mutate({ marketerId })}>
              <RefreshCw className="h-4 w-4 mr-1" /> Reset Usage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {marketer.promoCodes?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount %</TableHead>
                  <TableHead>Marketer %</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Toggle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketer.promoCodes.map((pc) => (
                  <TableRow key={pc.id}>
                    <TableCell className="font-mono">{pc.code}</TableCell>
                    <TableCell>{pc.discountPercentage}%</TableCell>
                    <TableCell>{pc.marketerPercentage}%</TableCell>
                    <TableCell>{pc.usageCount}</TableCell>
                    <TableCell><StatusBadge status={pc.isActive ? "Active" : "Inactive"} /></TableCell>
                    <TableCell>
                      <Switch
                        checked={pc.isActive}
                        onCheckedChange={() => togglePromo.mutate({ codeId: pc.id })}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">No promo codes yet</p>
          )}
        </CardContent>
      </Card>

      {/* Consultations */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>
            Consultations{" "}
            <Badge variant="secondary" className="ml-2 font-mono">{consultData?.total ?? consultationsList.length}</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportConsultations} disabled={consultationsList.length === 0 || consultLoading || isExportingConsult}>
              <Download className="h-4 w-4 mr-2" /> {isExportingConsult ? "Exporting..." : "Export to Excel"}
            </Button>
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">From</Label>
              <Input type="date" lang="en" value={consultFromDate} onChange={(e) => setConsultFromDate(e.target.value)} className="h-8 w-auto text-sm" dir="ltr" max={consultToDate} />
            </div>
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">To</Label>
              <Input type="date" lang="en" value={consultToDate} onChange={(e) => setConsultToDate(e.target.value)} className="h-8 w-auto text-sm" dir="ltr" min={consultFromDate} max={todayDate.toISOString().split("T")[0]} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {consultLoading ? (
            <p className="text-sm text-muted-foreground text-center py-6">Loading consultations...</p>
          ) : consultationsList.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Patient</TableHead>
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
        </CardContent>
      </Card>

      {/* Marketing Linked Subscriptions */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>
            Marketing Linked Subscriptions{" "}
            {referralData && (
              <Badge variant="secondary" className="ml-2 font-mono">{referralData.total}</Badge>
            )}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportReferral} disabled={!referralData?.data?.length || referralLoading || isExportingReferral}>
            <Download className="h-4 w-4 mr-2" /> {isExportingReferral ? "Exporting..." : "Export to Excel"}
          </Button>
        </CardHeader>
        <CardContent>
          {referralLoading ? (
            <p className="text-sm text-muted-foreground text-center py-6">Loading subscriptions...</p>
          ) : (referralData?.data ?? []).length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Referral Code</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Bundle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(referralData?.data ?? []).map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">#{s.id}</TableCell>
                      <TableCell className="font-mono text-xs">{s.referralCode?.code ?? "—"}</TableCell>
                      <TableCell>{s.patient?.user?.firstName} {s.patient?.user?.lastName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{s.bundle?.name ?? "—"}</TableCell>
                      <TableCell><StatusBadge status={s.status} /></TableCell>
                      <TableCell className="font-mono text-xs">{s.price} {s.currency ?? ""}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No marketing linked subscriptions found.
            </p>
          )}

          {/* Pagination */}
          {(referralData?.total ?? 0) > refLimit && (
            <div className="flex items-center justify-between px-1 py-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">{(refPage - 1) * refLimit + 1}</span>
                {" "}to{" "}
                <span className="font-medium text-foreground">{Math.min(refPage * refLimit, referralData?.total ?? 0)}</span>
                {" "}of{" "}
                <span className="font-medium text-foreground">{referralData?.total}</span>
              </p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground mr-2">
                  Page {refPage} of {Math.ceil((referralData?.total ?? 0) / refLimit) || 1}
                </span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setRefPage(1)} disabled={refPage === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setRefPage((p) => p - 1)} disabled={refPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setRefPage((p) => p + 1)} disabled={refPage >= Math.ceil((referralData?.total ?? 0) / refLimit)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setRefPage(Math.ceil((referralData?.total ?? 0) / refLimit))} disabled={refPage >= Math.ceil((referralData?.total ?? 0) / refLimit)}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Message Dialog */}
      <Dialog open={messageDialog} onOpenChange={setMessageDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Send Message to Marketer</DialogTitle></DialogHeader>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialog(false)}>Cancel</Button>
            <Button onClick={handleSendMessage} disabled={sendMessage.isPending}>
              {sendMessage.isPending ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Promo Code Dialog */}
      <Dialog open={generateDialog} onOpenChange={setGenerateDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Generate Promo Codes</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Number of Codes</Label>
              <Input type="number" min={1} value={promoConfig.numberOfCodes} onChange={(e) => { setPromoConfig({ ...promoConfig, numberOfCodes: Number(e.target.value) }); setPromoErrors({}); }} />
              {promoErrors.numberOfCodes && <p className="text-sm text-destructive">{promoErrors.numberOfCodes}</p>}
            </div>
            <div className="space-y-2">
              <Label>Discount Percentage</Label>
              <Input type="number" min={1} max={100} value={promoConfig.discountPercentage} onChange={(e) => { setPromoConfig({ ...promoConfig, discountPercentage: Number(e.target.value) }); setPromoErrors({}); }} />
              {promoErrors.discountPercentage && <p className="text-sm text-destructive">{promoErrors.discountPercentage}</p>}
            </div>
            <div className="space-y-2">
              <Label>Marketer Percentage</Label>
              <Input type="number" min={0} max={100} value={promoConfig.marketerPercentage} onChange={(e) => { setPromoConfig({ ...promoConfig, marketerPercentage: Number(e.target.value) }); setPromoErrors({}); }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateDialog(false)}>Cancel</Button>
            <Button onClick={handleGeneratePromo} disabled={generatePromo.isPending}>
              {generatePromo.isPending ? "Generating..." : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
