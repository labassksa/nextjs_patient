import { apiClient } from "@/lib/api/client";
import { normalizeWalletTransaction, toNumber, WalletTransaction } from "@/types/wallet";
import type {
  AdminMarketerWallet,
  CommissionUpdateRequest,
  CommissionUpdateResponse,
  PayoutRequest,
  PayoutResponse,
} from "../types/wallet.types";

interface RawAdminWalletResponse {
  success: true;
  data: Omit<AdminMarketerWallet, "balance" | "marketer" | "transactions"> & {
    balance: string | number;
    marketer: Omit<AdminMarketerWallet["marketer"], "commissionPercentage"> & {
      commissionPercentage: string | number;
    };
    transactions: Omit<AdminMarketerWallet["transactions"], "data"> & {
      data: WalletTransaction[];
    };
  };
}

export async function getAdminMarketerWallet(
  marketerId: number,
  page = 1,
  limit = 20
): Promise<AdminMarketerWallet> {
  const { data: response } = await apiClient.get<RawAdminWalletResponse>(
    `/admin/marketer-wallets/${marketerId}`,
    { params: { page, limit } }
  );

  return {
    ...response.data,
    balance: toNumber(response.data.balance),
    marketer: {
      ...response.data.marketer,
      commissionPercentage: toNumber(
        response.data.marketer.commissionPercentage
      ),
    },
    transactions: {
      ...response.data.transactions,
      data: (response.data.transactions.data ?? []).map(
        normalizeWalletTransaction
      ),
    },
  };
}

export async function recordMarketerPayout(
  request: PayoutRequest
): Promise<PayoutResponse> {
  const { marketerId, ...payload } = request;
  const response = await apiClient.post<PayoutResponse>(
    `/admin/marketer-wallets/${marketerId}/payout`,
    payload
  );
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Unexpected payout response status: ${response.status}`);
  }
  const { data } = response;
  return {
    ...data,
    data: { ...data.data, balance: toNumber(data.data.balance) },
  };
}

export async function updateMarketerCommission(
  request: CommissionUpdateRequest
): Promise<CommissionUpdateResponse> {
  const { marketerId, percentage } = request;
  const { data } = await apiClient.patch<CommissionUpdateResponse>(
    `/admin/marketer-wallets/${marketerId}/commission`,
    { percentage }
  );
  return data;
}
