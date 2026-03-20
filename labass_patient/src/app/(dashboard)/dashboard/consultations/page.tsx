"use client";

import { useState, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useConsultations, useSendFollowUp } from "@/features/dashboard/hooks/use-consultations";
import type { Consultation } from "@/features/dashboard/types/consultation.types";
import { DataTable } from "@/features/dashboard/components/shared/data-table";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { StatusBadge } from "@/features/dashboard/components/shared/status-badge";
import { SearchInput } from "@/features/dashboard/components/shared/search-input";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

const columns: ColumnDef<Consultation>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-muted-foreground">#{row.original.id}</span>
    ),
  },
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: ({ row }) => <span className="font-medium">{row.original.patientName}</span>,
  },
  {
    accessorKey: "doctorName",
    header: "Doctor",
    cell: ({ row }) => <span className="font-medium">{row.original.doctorName}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal capitalize">{row.original.type}</Badge>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.paymentMethod || "—"}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return date ? (
        <span className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString()}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
];

export default function ConsultationsPage() {
  const { data, isLoading, error, refetch } = useConsultations();
  const sendFollowUp = useSendFollowUp();
  const [search, setSearch] = useState("");
  const [followUpDialog, setFollowUpDialog] = useState<{ open: boolean; consultationId: string }>({
    open: false,
    consultationId: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Through Labass Platform");

  const handleSearch = useCallback((value: string) => setSearch(value), []);

  const handleSendFollowUp = async () => {
    await sendFollowUp.mutateAsync({
      consultationId: followUpDialog.consultationId,
      paymentMethod,
    });
    setFollowUpDialog({ open: false, consultationId: "" });
  };

  const columnsWithActions: ColumnDef<Consultation>[] = [
    ...columns,
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() =>
            setFollowUpDialog({ open: true, consultationId: String(row.original.id) })
          }
        >
          <Send className="h-4 w-4 mr-1" /> Follow Up
        </Button>
      ),
    },
  ];

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const consultations = Array.isArray(data) ? data : [];

  return (
    <div>
      <PageHeader title="Consultations" description="View and manage all consultations" />

      <div className="mb-4">
        <SearchInput
          placeholder="Search by patient or doctor..."
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>

      <DataTable
        columns={columnsWithActions}
        data={consultations}
        isLoading={isLoading}
        searchKey="patientName"
        searchValue={search}
      />

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
