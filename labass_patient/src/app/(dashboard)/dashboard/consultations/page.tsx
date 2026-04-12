"use client";

import { useState } from "react";
import { useConsultationsReport } from "@/features/dashboard/hooks/use-consultations";
import { useSendFollowUp } from "@/features/dashboard/hooks/use-consultations";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { StatusBadge } from "@/features/dashboard/components/shared/status-badge";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Send, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function ConsultationsPage() {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  const [fromDate, setFromDate] = useState(weekAgo.toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(today.toISOString().split("T")[0]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: reportData, isLoading, error, refetch } = useConsultationsReport(fromDate, toDate, page, limit);
  const sendFollowUp = useSendFollowUp();

  const [followUpDialog, setFollowUpDialog] = useState<{ open: boolean; consultationId: string }>({
    open: false,
    consultationId: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Through Labass Platform");

  const handleSendFollowUp = async () => {
    await sendFollowUp.mutateAsync({
      consultationId: followUpDialog.consultationId,
      paymentMethod,
    });
    setFollowUpDialog({ open: false, consultationId: "" });
  };

  const handleExport = async () => {
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
    XLSX.writeFile(wb, `consultations-${fromDate}-to-${toDate}.xlsx`);
  };

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const consultationsList = reportData?.consultations ?? [];
  const total = reportData?.total ?? consultationsList.length;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div>
      <PageHeader title="Consultations" description="View and manage all consultations" />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>
            Consultations{" "}
            <Badge variant="secondary" className="ml-2 font-mono">{total}</Badge>
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
            <Button variant="outline" size="sm" onClick={handleExport} disabled={consultationsList.length === 0 || isLoading}>
              <Download className="h-4 w-4 mr-2" /> Export to Excel
            </Button>
          </div>

          {isLoading ? (
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
                    <TableHead></TableHead>
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
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => setFollowUpDialog({ open: true, consultationId: String(c.id) })}
                        >
                          <Send className="h-4 w-4 mr-1" /> Follow Up
                        </Button>
                      </TableCell>
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
                      {[10, 20, 30, 50].map((size) => (
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
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
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
              <Input
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
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
