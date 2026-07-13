export type WalletPeriod = "week" | "month" | "all";

export type WalletTxnType = "consultation" | "subscription";
export type WalletTxnStatus = "completed" | "pending";

export interface WalletTransaction {
  id: string;
  type: WalletTxnType;
  patientLabel: string;
  amount: number;
  date: string;
  status: WalletTxnStatus;
}

export type PayoutMethod = "stcpay" | "bank";
export type PayoutStatus = "completed" | "processing";

export interface PayoutRecord {
  id: string;
  amount: number;
  date: string;
  method: PayoutMethod;
  status: PayoutStatus;
}

export interface WalletPeriodData {
  consultationsCount: number;
  subscriptionsCount: number;
  earned: number;
  transactions: WalletTransaction[];
}

export interface WalletData {
  balance: number;
  totalEarned: number;
  commissionPercentage: number;
  referralCode: string;
  marketingLink: string;
  periods: Record<WalletPeriod, WalletPeriodData>;
  payouts: PayoutRecord[];
}
