"use client";

import { useState } from "react";
import { useConsultationsReport, useSendFollowUp } from "@/features/dashboard/hooks/use-consultations";
import { getConsultationReport } from "@/features/dashboard/api/consultations.api";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { ConsultationReportTable } from "@/features/dashboard/components/shared/consultation-report-table";
import { exportConsultationReportToExcel } from "@/features/dashboard/utils/consultation-report";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Download, Send } from "lucide-react";

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ConsultationsPage() {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState(formatDateInput(monthStart));
  const [toDate, setToDate] = useState(formatDateInput(today));
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isExporting, setIsExporting] = useState(false);
  const [followUpDialog, setFollowUpDialog] = useState<{ open: boolean; consultationId: string }>({
    open: false,
    consultationId: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Through Labass Platform");

  const { data: reportData, isLoading, error, refetch } = useConsultationsReport(fromDate || undefined, toDate || undefined, page, limit);
  const sendFollowUp = useSendFollowUp();

  const handleSendFollowUp = async () => {
    await sendFollowUp.mutateAsync({
      consultationId: followUpDialog.consultationId,
      paymentMethod,
    });
    setFollowUpDialog({ open: false, consultationId: "" });
  };

  const handleExport = async () => {
    const filename = `الاستشارات الطبية - ${fromDate || "default"} - ${toDate || "default"}`;
    const titleText = `الاستشارات الطبية من الفترة ${fromDate || "بداية الشهر"} الي ${toDate || "الآن"}`;

    setIsExporting(true);
    try {
      const allData = await getConsultationReport({
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: 1,
        limit: reportData?.total || limit,
      });
      await exportConsultationReportToExcel({
        filename,
        titleText,
        rows: allData.consultations ?? [],
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const consultationsList = reportData?.consultations ?? [];
  const total = reportData?.total ?? 0;

  return (
    <div>
      <PageHeader title="Consultations" description="View and manage all consultations" />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>
            Consultations{" "}
            <Badge variant="secondary" className="ml-2 font-mono">{total}</Badge>
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">From</Label>
              <Input
                type="date"
                lang="en"
                value={fromDate}
                onChange={(event) => { setFromDate(event.target.value); setPage(1); }}
                className="h-8 w-auto text-sm"
                dir="ltr"
                max={toDate || undefined}
              />
            </div>
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">To</Label>
              <Input
                type="date"
                lang="en"
                value={toDate}
                onChange={(event) => { setToDate(event.target.value); setPage(1); }}
                className="h-8 w-auto text-sm"
                dir="ltr"
                min={fromDate || undefined}
                max={formatDateInput(today)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setFromDate(""); setToDate(""); setPage(1); }}
            >
              Backend default dates
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-3">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={consultationsList.length === 0 || isLoading || isExporting}>
              <Download className="h-4 w-4 mr-2" /> {isExporting ? "Exporting..." : "Export to Excel"}
            </Button>
          </div>

          <ConsultationReportTable
            data={reportData}
            isLoading={isLoading}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            actionHeader="Actions"
            renderActions={(consultation) => (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                disabled={!consultation.id}
                onClick={() => setFollowUpDialog({ open: true, consultationId: String(consultation.id) })}
              >
                <Send className="h-4 w-4 mr-1" /> Follow Up
              </Button>
            )}
          />
        </CardContent>
      </Card>

      <Dialog open={followUpDialog.open} onOpenChange={(open) => setFollowUpDialog({ ...followUpDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Follow Up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Consultation ID</Label>
              <Input value={followUpDialog.consultationId} disabled />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Input value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowUpDialog({ open: false, consultationId: "" })}>
              Cancel
            </Button>
            <Button onClick={handleSendFollowUp} disabled={sendFollowUp.isPending}>
              {sendFollowUp.isPending ? "Sending..." : "Send Follow Up"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
