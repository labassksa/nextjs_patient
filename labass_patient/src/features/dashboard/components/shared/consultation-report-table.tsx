"use client";

import type { ConsultationReportResponse } from "@/features/dashboard/types/consultation.types";
import type { ReactNode } from "react";
import {
  EMPTY_REPORT_VALUE,
  formatBundleType,
  formatReportAmount,
  formatReportDateTime,
  formatReportName,
  formatReportValue,
  getCurrentPageSubtotal,
} from "@/features/dashboard/utils/consultation-report";
import { StatusBadge } from "./status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ExternalLink } from "lucide-react";

interface ConsultationReportTableProps {
  data?: ConsultationReportResponse;
  isLoading?: boolean;
  emptyMessage?: string;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limitOptions?: number[];
  actionHeader?: string;
  renderActions?: (row: ConsultationReportResponse["consultations"][number]) => ReactNode;
}

export function ConsultationReportTable({
  data,
  isLoading = false,
  emptyMessage = "No consultations found for the selected filters.",
  page,
  limit,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 25, 50, 100],
  actionHeader = "",
  renderActions,
}: ConsultationReportTableProps) {
  const consultations = data?.consultations ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const responsePage = data?.page ?? page;
  const responseLimit = data?.limit ?? limit;
  const subtotal = getCurrentPageSubtotal(consultations);
  const firstVisible = total > 0 ? (responsePage - 1) * responseLimit + 1 : 0;
  const lastVisible = Math.min(responsePage * responseLimit, total);
  const hasPreviousPage = data?.hasPreviousPage ?? page > 1;
  const hasNextPage = data?.hasNextPage ?? page < totalPages;

  if (isLoading) {
    return <p className="text-sm text-muted-foreground text-center py-6">Loading consultations...</p>;
  }

  if (consultations.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-6">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-md border bg-muted/20 p-3">
        <div>
          <p className="text-xs text-muted-foreground">Total rows from backend</p>
          <p className="text-lg font-semibold tabular-nums">{total}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Current page subtotal</p>
          <p className="text-lg font-semibold tabular-nums">{formatReportAmount(subtotal)}</p>
          <p className="text-xs text-muted-foreground">Only sums rows visible on this page.</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Page</p>
          <p className="text-lg font-semibold tabular-nums">
            {responsePage} of {totalPages}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[2300px]">
          <TableHeader>
            <TableRow>
              <TableHead>Consultation ID</TableHead>
              <TableHead>Created date/time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid at</TableHead>
              <TableHead>Closed at</TableHead>
              <TableHead>Doctor joined at</TableHead>
              <TableHead>Patient joined at</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Payment method</TableHead>
              <TableHead>Prescription PDF</TableHead>
              <TableHead>Marketer name</TableHead>
              <TableHead>Marketer phone</TableHead>
              <TableHead>Marketer organization</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Patient name</TableHead>
              <TableHead>Patient phone</TableHead>
              <TableHead>Doctor name</TableHead>
              <TableHead>Doctor phone</TableHead>
              <TableHead>Subscription ID</TableHead>
              <TableHead>Bundle type</TableHead>
              <TableHead>Remaining consultations</TableHead>
              {renderActions && <TableHead>{actionHeader}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultations.map((consultation, index) => (
              <TableRow key={consultation.id ?? index}>
                <TableCell className="font-mono text-xs">
                  {consultation.id ? `#${consultation.id}` : EMPTY_REPORT_VALUE}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatReportDateTime(consultation.createdAt)}
                </TableCell>
                <TableCell>
                  {consultation.status ? <StatusBadge status={consultation.status} /> : EMPTY_REPORT_VALUE}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatReportDateTime(consultation.paidAT)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatReportDateTime(consultation.closedAt)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatReportDateTime(consultation.doctorJoinedAT)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatReportDateTime(consultation.patientJoinedAT)}
                </TableCell>
                <TableCell className="font-mono text-xs whitespace-nowrap">
                  {formatReportAmount(consultation.price)}
                </TableCell>
                <TableCell>
                  {consultation.paymentMethod ? (
                    <Badge variant="outline" className="whitespace-nowrap">{consultation.paymentMethod}</Badge>
                  ) : (
                    EMPTY_REPORT_VALUE
                  )}
                </TableCell>
                <TableCell>
                  {consultation.prescriptionPDFUrl ? (
                    <a
                      href={consultation.prescriptionPDFUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-custom-green hover:underline"
                    >
                      Open <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    EMPTY_REPORT_VALUE
                  )}
                </TableCell>
                <TableCell>{formatReportName(consultation.marketer)}</TableCell>
                <TableCell className="font-mono text-xs" dir="ltr">
                  {formatReportValue(consultation.marketer?.phoneNumber)}
                </TableCell>
                <TableCell>{formatReportValue(consultation.marketer?.orgName)}</TableCell>
                <TableCell className="font-mono text-xs">
                  {consultation.patient?.id ? `#${consultation.patient.id}` : EMPTY_REPORT_VALUE}
                </TableCell>
                <TableCell>{formatReportName(consultation.patient)}</TableCell>
                <TableCell className="font-mono text-xs" dir="ltr">
                  {formatReportValue(consultation.patient?.phoneNumber)}
                </TableCell>
                <TableCell>{formatReportName(consultation.doctor)}</TableCell>
                <TableCell className="font-mono text-xs" dir="ltr">
                  {formatReportValue(consultation.doctor?.phoneNumber)}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {consultation.subscription?.id ? `#${consultation.subscription.id}` : EMPTY_REPORT_VALUE}
                </TableCell>
                <TableCell>{formatBundleType(consultation.subscription?.bundleType)}</TableCell>
                <TableCell className="font-mono text-xs">
                  {formatReportValue(consultation.subscription?.remainingConsultations)}
                </TableCell>
                {renderActions && <TableCell>{renderActions(consultation)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{firstVisible}</span> to{" "}
            <span className="font-medium text-foreground">{lastVisible}</span> of{" "}
            <span className="font-medium text-foreground">{total}</span> results
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={String(limit)}
              onValueChange={(val) => {
                onLimitChange(Number(val));
                onPageChange(1);
              }}
            >
              <SelectTrigger className="h-8 w-[76px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground mr-2">
            Page {responsePage} of {totalPages}
          </span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(1)} disabled={!hasPreviousPage}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={!hasPreviousPage}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(page + 1)} disabled={!hasNextPage}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onPageChange(totalPages)} disabled={!hasNextPage}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
