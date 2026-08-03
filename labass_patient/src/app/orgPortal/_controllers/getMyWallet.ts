import { apiClient } from "@/lib/api/client";
import {
  MyWallet,
  normalizeWalletTransaction,
  toNumber,
  WalletTransaction,
  WalletTransactionsPage,
} from "@/types/wallet";

interface MyWalletResponse {
  success: true;
  data: Omit<MyWallet, "balance" | "commissionPercentage" | "recentTransactions"> & {
    balance: string | number;
    commissionPercentage: string | number;
    recentTransactions: WalletTransaction[];
  };
}

export async function getMyWallet(): Promise<MyWallet> {
  const { data: response } = await apiClient.get<MyWalletResponse>("/my-wallet");

  return {
    ...response.data,
    balance: toNumber(response.data.balance),
    commissionPercentage: toNumber(response.data.commissionPercentage),
    recentTransactions: (response.data.recentTransactions ?? []).map(
      normalizeWalletTransaction
    ),
  };
}

export async function getMyWalletTransactions(
  page = 1,
  limit = 20
): Promise<WalletTransactionsPage> {
  const { data: response } = await apiClient.get<
    Omit<WalletTransactionsPage, "data"> & {
      data: WalletTransaction[];
    }
  >("/my-wallet/transactions", {
    params: { page, limit },
  });

  return {
    ...response,
    data: (response.data ?? []).map(normalizeWalletTransaction),
  };
}
