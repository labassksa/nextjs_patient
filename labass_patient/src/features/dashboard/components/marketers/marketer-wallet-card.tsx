"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  Banknote,
  ChevronLeft,
  ChevronRight,
  Percent,
  RefreshCw,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminMarketerWallet,
  useRecordMarketerPayout,
  useUpdateMarketerCommission,
} from "../../hooks/use-wallets";
import type { PayoutRequest } from "../../types/wallet.types";

const PAGE_LIMIT = 20;

const transactionLabels = {
  consultation_commission: "Consultation commission",
  subscription_commission: "Subscription commission",
  payout: "Payout",
  adjustment: "Wallet adjustment",
};

const storageKey = (marketerId: number) =>
  `pending-wallet-payout:${marketerId}`;

function getStoredPayout(marketerId: number): PayoutRequest | null {
  try {
    const value = sessionStorage.getItem(storageKey(marketerId));
    if (!value) return null;
    const request = JSON.parse(value) as PayoutRequest;
    return request.marketerId === marketerId ? request : null;
  } catch {
    return null;
  }
}

function storePayout(request: PayoutRequest) {
  sessionStorage.setItem(
    storageKey(request.marketerId),
    JSON.stringify(request)
  );
}

function clearStoredPayout(marketerId: number) {
  sessionStorage.removeItem(storageKey(marketerId));
}

function getApiError(error: unknown) {
  if (!axios.isAxiosError(error)) return "The request failed. Please try again.";
  return (
    error.response?.data?.message ??
    error.response?.data?.error ??
    (error.code === "ECONNABORTED"
      ? "The request timed out. Retry the pending payout to reuse its reference."
      : "The request failed. Please try again.")
  );
}

export function MarketerWalletCard({ marketerId }: { marketerId: number }) {
  const [page, setPage] = useState(1);
  const [commission, setCommission] = useState(0);
  const [payoutDialog, setPayoutDialog] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutNote, setPayoutNote] = useState("");
  const [pendingPayout, setPendingPayout] = useState<PayoutRequest | null>(null);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [payoutSuccess, setPayoutSuccess] = useState<string | null>(null);
  const [commissionError, setCommissionError] = useState<string | null>(null);
  const [commissionSuccess, setCommissionSuccess] = useState(false);

  const walletQuery = useAdminMarketerWallet(marketerId, page, PAGE_LIMIT);
  const payoutMutation = useRecordMarketerPayout(marketerId);
  const commissionMutation = useUpdateMarketerCommission(marketerId);
  const wallet = walletQuery.data;
  const currentCommission = wallet?.marketer.commissionPercentage;

  useEffect(() => {
    setPendingPayout(getStoredPayout(marketerId));
  }, [marketerId]);

  useEffect(() => {
    if (currentCommission != null) setCommission(currentCommission);
  }, [currentCommission]);

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: wallet?.currency ?? "SAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  const submitStoredPayout = async (request: PayoutRequest) => {
    setPayoutError(null);
    setPayoutSuccess(null);
    try {
      const response = await payoutMutation.mutateAsync(request);
      clearStoredPayout(marketerId);
      setPendingPayout(null);
      setPayoutDialog(false);
      setPayoutAmount("");
      setPayoutNote("");
      setPayoutSuccess(
        response.data.idempotentReplay
          ? "The existing payout was confirmed successfully."
          : "Payout recorded successfully."
      );
    } catch (error) {
      setPayoutError(getApiError(error));
    }
  };

  const createPayout = async () => {
    const amount = Number(payoutAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setPayoutError("Enter an amount greater than zero.");
      return;
    }
    if (wallet && amount > wallet.balance) {
      setPayoutError("The payout cannot exceed the current balance.");
      return;
    }
    if (pendingPayout) {
      setPayoutError(
        "A payout is still pending confirmation. Retry that request before creating another."
      );
      return;
    }

    const request: PayoutRequest = {
      marketerId,
      amount,
      note: payoutNote.trim(),
      payoutReference: crypto.randomUUID(),
    };
    try {
      storePayout(request);
    } catch {
      setPayoutError(
        "The payout reference could not be saved in this browser. The request was not sent."
      );
      return;
    }
    setPendingPayout(request);
    await submitStoredPayout(request);
  };

  const updateCommission = async () => {
    setCommissionError(null);
    setCommissionSuccess(false);
    if (!Number.isFinite(commission) || commission < 0 || commission > 100) {
      setCommissionError("Commission must be between 0 and 100.");
      return;
    }

    try {
      await commissionMutation.mutateAsync({
        marketerId,
        percentage: commission,
      });
      setCommissionSuccess(true);
    } catch (error) {
      setCommissionError(getApiError(error));
    }
  };

  const discardConflict = () => {
    clearStoredPayout(marketerId);
    setPendingPayout(null);
    setPayoutError(null);
  };

  if (walletQuery.isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading wallet...
        </CardContent>
      </Card>
    );
  }

  if (walletQuery.isError || !wallet) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-destructive">Could not load this wallet.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => walletQuery.refetch()}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const transactions = wallet.transactions;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <WalletCards className="h-5 w-5 text-custom-green" /> Wallet
          </CardTitle>
          <Button
            variant="outline"
            size="icon"
            title="Refresh wallet"
            onClick={() => walletQuery.refetch()}
            disabled={walletQuery.isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${walletQuery.isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border p-4">
              <p className="text-sm text-muted-foreground">Current balance</p>
              <p className="mt-1 text-2xl font-bold tabular-nums" dir="ltr">
                {formatMoney(wallet.balance)}
              </p>
              <Button
                className="mt-4"
                size="sm"
                onClick={() => setPayoutDialog(true)}
                disabled={wallet.balance <= 0}
              >
                <Banknote className="mr-2 h-4 w-4" /> Record payout
              </Button>
            </div>

            <div className="border p-4">
              <Label htmlFor="wallet-commission">Commission percentage</Label>
              <div className="mt-2 flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="wallet-commission"
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    value={commission}
                    onChange={(event) => {
                      setCommission(Number(event.target.value));
                      setCommissionError(null);
                      setCommissionSuccess(false);
                    }}
                    className="pr-9"
                  />
                  <Percent className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <Button
                  onClick={updateCommission}
                  disabled={commissionMutation.isPending}
                >
                  {commissionMutation.isPending ? "Saving..." : "Update"}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Applies to future commission transactions only.
              </p>
              {commissionError && (
                <p className="mt-2 text-sm text-destructive">{commissionError}</p>
              )}
              {commissionSuccess && (
                <p className="mt-2 text-sm text-green-700">Commission updated.</p>
              )}
            </div>
          </div>

          {pendingPayout && (
            <div className="border border-amber-200 bg-amber-50 p-4 text-sm">
              <p className="font-medium text-amber-900">
                A payout request is awaiting confirmation.
              </p>
              <p className="mt-1 text-amber-800">
                {formatMoney(pendingPayout.amount)} · {pendingPayout.note || "No note"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => submitStoredPayout(pendingPayout)}
                  disabled={payoutMutation.isPending}
                >
                  {payoutMutation.isPending ? "Retrying..." : "Retry same request"}
                </Button>
                {axios.isAxiosError(payoutMutation.error) &&
                  payoutMutation.error.response?.status === 409 && (
                    <Button variant="outline" size="sm" onClick={discardConflict}>
                      Discard conflicted request
                    </Button>
                  )}
              </div>
            </div>
          )}

          {payoutError && (
            <p className="border border-red-200 bg-red-50 p-3 text-sm text-destructive">
              {payoutError}
            </p>
          )}
          {payoutSuccess && (
            <p className="border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {payoutSuccess}
            </p>
          )}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Transactions</h3>
              <Badge variant="secondary">{transactions.total}</Badge>
            </div>
            {transactions.data.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No wallet transactions yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Note / reference</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.data.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transactionLabels[transaction.type]}</TableCell>
                        <TableCell
                          className={`font-mono font-medium ${
                            transaction.amount >= 0 ? "text-green-700" : "text-red-700"
                          }`}
                          dir="ltr"
                        >
                          {transaction.amount >= 0 ? "+" : "-"}
                          {formatMoney(Math.abs(transaction.amount))}
                        </TableCell>
                        <TableCell className="max-w-xs text-xs text-muted-foreground">
                          <p className="truncate">{transaction.note || "—"}</p>
                          {transaction.payoutReference && (
                            <p className="truncate font-mono" title={transaction.payoutReference}>
                              {transaction.payoutReference}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {transactions.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  title="Previous page"
                  disabled={page <= 1 || walletQuery.isFetching}
                  onClick={() => setPage((value) => value - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {transactions.page} of {transactions.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  title="Next page"
                  disabled={page >= transactions.totalPages || walletQuery.isFetching}
                  onClick={() => setPage((value) => value + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={payoutDialog}
        onOpenChange={(open) => {
          setPayoutDialog(open);
          if (open) setPayoutError(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record payout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payout-amount">Amount</Label>
              <Input
                id="payout-amount"
                type="number"
                min="0.01"
                step="0.01"
                max={wallet.balance}
                value={payoutAmount}
                onChange={(event) => setPayoutAmount(event.target.value)}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                Available: {formatMoney(wallet.balance)}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payout-note">Note</Label>
              <Textarea
                id="payout-note"
                value={payoutNote}
                onChange={(event) => setPayoutNote(event.target.value)}
                placeholder="Weekly payout or bank reference"
                rows={3}
              />
            </div>
            {payoutError && (
              <p className="text-sm text-destructive">{payoutError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayoutDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createPayout} disabled={payoutMutation.isPending}>
              {payoutMutation.isPending ? "Submitting..." : "Confirm payout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
