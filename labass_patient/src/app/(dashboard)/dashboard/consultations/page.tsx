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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Send } from "lucide-react";

export default function ConsultationsPage() {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  const [fromDate, setFromDate] = useState(weekAgo.toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(today.toISOString().split("T")[0]);

  const { data: reportData, isLoading, error, refetch } = useConsultationsReport(fromDate, toDate);
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

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const consultationsList = reportData?.consultations ?? [];

  return (
    <div>
      <PageHeader title="Consultations" description="View and manage all consultations" />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>
            Consultations{" "}
            <Badge variant="secondary" className="ml-2 font-mono">{reportData?.total ?? consultationsList.length}</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">From</Label>
              <Input type="date" lang="en" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-8 w-auto text-sm" dir="ltr" max={toDate} />
            </div>
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">To</Label>
              <Input type="date" lang="en" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-8 w-auto text-sm" dir="ltr" min={fromDate} max={today.toISOString().split("T")[0]} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
