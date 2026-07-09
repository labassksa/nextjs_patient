"use client";

import { useState } from "react";
import { useSubscriptionConsultations } from "@/features/dashboard/hooks/use-subscription-consultations";
import { getSubscriptionConsultations } from "@/features/dashboard/api/subscription-consultations.api";
import type {
  AdminSubscriptionConsultation,
  SubscriptionConsultationsVariant,
} from "@/features/dashboard/types/subscription-consultation.types";
import { StatusBadge } from "./status-badge";
import { ErrorState } from "./error-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { labelForBundleType, bundleTypeOptions } from "@/utils/bundleType";

const PAGE_SIZES = [20, 50, 100];

const fullName = (u?: { firstName?: string; lastName?: string } | null): string =>
  u ? [u.firstName, u.lastName].filter(Boolean).join(" ") : "";

export function SubscriptionConsultationsTable({
  variant,
}: {
  variant: SubscriptionConsultationsVariant;
}) {
  const isOrg = variant === "organizations";
  // Local calendar date (en-CA => YYYY-MM-DD); avoids UTC skew that would block "today" in UTC+ zones.
  const today = new Date().toLocaleDateString("en-CA");

  const [bundleType, setBundleType] = useState("ALL");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isExporting, setIsExporting] = useState(false);

  const buildParams = (over?: { page?: number; limit?: number }) => ({
    bundleType: bundleType !== "ALL" ? bundleType : undefined,
    subscriptionId: subscriptionId ? Number(subscriptionId) : undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    page: over?.page ?? page,
    limit: over?.limit ?? limit,
  });

  const { data, isLoading, isFetching, error, refetch } = useSubscriptionConsultations(
    variant,
    buildParams()
  );

  const consultations = data?.consultations ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  // Reset to page 1 whenever a filter changes.
  const resetPage = () => setPage(1);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const ExcelJS = (await import("exceljs")).default;
      const all = await getSubscriptionConsultations(variant, {
        ...buildParams({ page: 1, limit: total || 10000 }),
      });

      const HEADERS = isOrg
        ? ["Consultation ID", "Organization", "Marketer", "Patient", "Bundle Type", "Consultation Type", "Status", "Created"]
        : ["Consultation ID", "Patient", "Bundle Type", "Consultation Type", "Status", "Created"];

      const titleText = `الاستشارات الطبية للاشتراكات - ${isOrg ? "المنشآت" : "الأفراد"}`;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Subscription Consultations");

      worksheet.mergeCells(1, 1, 1, HEADERS.length);
      const titleCell = worksheet.getCell("A1");
      titleCell.value = titleText;
      titleCell.font = { bold: true, size: 14 };
      titleCell.alignment = { horizontal: "center", vertical: "middle", readingOrder: "rtl" };
      worksheet.getRow(1).height = 28;

      worksheet.addRow([]);

      const headerRow = worksheet.addRow(HEADERS);
      headerRow.font = { bold: true };
      headerRow.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0E0E0" } };
      });

      for (const c of all.consultations ?? []) {
        const bundleLabel = labelForBundleType(c.subscription?.bundle?.type, "en");
        const created = new Date(c.createdAt).toLocaleDateString();
        const row = isOrg
          ? [
              c.id,
              c.subscription?.organization?.name ?? "",
              fullName(c.marketer?.user),
              fullName(c.patient?.user),
              bundleLabel,
              c.labConsultationType || c.type,
              c.status,
              created,
            ]
          : [
              c.id,
              fullName(c.patient?.user),
              bundleLabel,
              c.labConsultationType || c.type,
              c.status,
              created,
            ];
        worksheet.addRow(row);
      }

      HEADERS.forEach((_, i) => {
        worksheet.getColumn(i + 1).width = 20;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${titleText}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const colCount = isOrg ? 8 : 6;

  return (
    <Card>
      <CardHeader className="gap-4 py-3">
        <div className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-base">
            Consultations{" "}
            <Badge variant="secondary" className="ml-2 font-mono">{total}</Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={consultations.length === 0 || isLoading || isExporting}
          >
            <Download className="h-4 w-4 mr-2" /> {isExporting ? "Exporting..." : "Export to Excel"}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1 min-w-[180px]">
            <Label className="text-xs text-muted-foreground">Bundle Type</Label>
            <Select
              value={bundleType}
              onValueChange={(v) => { setBundleType(v); resetPage(); }}
            >
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Bundle Types</SelectItem>
                {bundleTypeOptions("en").map((bt) => (
                  <SelectItem key={bt.value} value={bt.value}>{bt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 w-[150px]">
            <Label className="text-xs text-muted-foreground">Subscription ID</Label>
            <Input
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="All"
              value={subscriptionId}
              onChange={(e) => { setSubscriptionId(e.target.value); resetPage(); }}
              className="h-9"
            />
          </div>

          <div className="flex items-end gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">From</Label>
              <Input
                type="date"
                lang="en"
                dir="ltr"
                value={fromDate}
                max={toDate || today}
                onChange={(e) => { setFromDate(e.target.value); resetPage(); }}
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
                onChange={(e) => { setToDate(e.target.value); resetPage(); }}
                className="h-9 w-auto text-sm"
              />
            </div>
          </div>
        </div>
        {(fromDate || toDate) && !(fromDate && toDate) && (
          <p className="text-xs text-amber-600">
            Pick both From and To — a single date is ignored.
          </p>
        )}
      </CardHeader>

      <CardContent>
        {error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  {isOrg && <TableHead>Organization</TableHead>}
                  {isOrg && <TableHead>Marketer</TableHead>}
                  <TableHead>Patient</TableHead>
                  <TableHead>Bundle Type</TableHead>
                  <TableHead>Consultation Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={colCount} className="text-center text-sm text-muted-foreground py-10">
                      Loading consultations...
                    </TableCell>
                  </TableRow>
                ) : consultations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={colCount} className="text-center text-sm text-muted-foreground py-10">
                      No subscription consultations found for the selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  consultations.map((c: AdminSubscriptionConsultation) => (
                    <TableRow key={c.id} className={isFetching ? "opacity-60" : ""}>
                      <TableCell className="font-mono text-xs">#{c.id}</TableCell>
                      {isOrg && (
                        <TableCell className="font-medium">
                          {c.subscription?.organization?.name ?? "—"}
                        </TableCell>
                      )}
                      {isOrg && (
                        <TableCell>{fullName(c.marketer?.user) || "—"}</TableCell>
                      )}
                      <TableCell>{fullName(c.patient?.user) || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.subscription?.bundle?.type
                          ? labelForBundleType(c.subscription.bundle.type, "en")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {c.labConsultationType || c.type || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell><StatusBadge status={c.status} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {!error && consultations.length > 0 && (
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
                <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
                  <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZES.map((size) => (
                      <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground mr-2">Page {page} of {totalPages}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(1)} disabled={page === 1}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(totalPages)} disabled={page >= totalPages}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
