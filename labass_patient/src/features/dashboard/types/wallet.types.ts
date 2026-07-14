import type {
  NormalizedWalletTransaction,
  WalletTransaction,
} from "@/types/wallet";

export interface AdminMarketerWallet {
  marketer: {
    id: number;
    promoterName?: string | null;
    commissionPercentage: number;
    user?: Record<string, unknown>;
    organization?: Record<string, unknown>;
  };
  balance: number;
  currency: string;
  transactions: {
    data: NormalizedWalletTransaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PayoutRequest {
  marketerId: number;
  amount: number;
  note: string;
  payoutReference: string;
}

export interface PayoutResponse {
  success: true;
  data: {
    transaction: WalletTransaction;
    balance: number;
    currency: string;
    idempotentReplay: boolean;
  };
}

export interface CommissionUpdateRequest {
  marketerId: number;
  percentage: number;
}

export interface CommissionUpdateResponse {
  success: true;
  data: {
    marketerId: number;
    commissionPercentage: number;
  };
}
