export type MoneyValue = string | number;

export type WalletTransactionType =
  | "consultation_commission"
  | "subscription_commission"
  | "payout"
  | "adjustment";

export type WalletSourceType = "consultation" | "subscription" | "manual";

export interface WalletTransaction {
  id: number;
  amount: MoneyValue;
  type: WalletTransactionType;
  sourceType?: WalletSourceType | null;
  sourceId?: number | null;
  baseAmount?: MoneyValue | null;
  commissionRate?: MoneyValue | null;
  payoutReference?: string | null;
  note?: string | null;
  createdBy?: number | null;
  createdAt: string;
}

export interface NormalizedWalletTransaction
  extends Omit<WalletTransaction, "amount" | "baseAmount" | "commissionRate"> {
  amount: number;
  baseAmount: number | null;
  commissionRate: number | null;
}

export interface MyWallet {
  balance: number;
  currency: string;
  commissionPercentage: number;
  recentTransactions: NormalizedWalletTransaction[];
}

export interface WalletTransactionsPage {
  success: true;
  currency: string;
  data: NormalizedWalletTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const toNumber = (value: MoneyValue | null | undefined) =>
  Number(value ?? 0);

export function normalizeWalletTransaction(
  transaction: WalletTransaction
): NormalizedWalletTransaction {
  return {
    ...transaction,
    amount: toNumber(transaction.amount),
    baseAmount:
      transaction.baseAmount == null ? null : toNumber(transaction.baseAmount),
    commissionRate:
      transaction.commissionRate == null
        ? null
        : toNumber(transaction.commissionRate),
  };
}
