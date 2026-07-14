import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import {
  getAdminMarketerWallet,
  recordMarketerPayout,
  updateMarketerCommission,
} from "../api/wallets.api";

export function useAdminMarketerWallet(
  marketerId: number,
  page: number,
  limit = 20
) {
  return useQuery({
    queryKey: queryKeys.wallets.adminTransactions(marketerId, page, limit),
    queryFn: () => getAdminMarketerWallet(marketerId, page, limit),
    enabled: Number.isInteger(marketerId) && marketerId > 0,
  });
}

function useInvalidateWalletQueries(marketerId: number) {
  const queryClient = useQueryClient();
  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.adminList }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.adminDetail(marketerId),
      }),
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.myWallet }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.myTransactions,
      }),
    ]);
  };
}

export function useRecordMarketerPayout(marketerId: number) {
  const invalidateWallets = useInvalidateWalletQueries(marketerId);
  return useMutation({
    mutationFn: recordMarketerPayout,
    retry: false,
    onSuccess: invalidateWallets,
  });
}

export function useUpdateMarketerCommission(marketerId: number) {
  const invalidateWallets = useInvalidateWalletQueries(marketerId);
  return useMutation({
    mutationFn: updateMarketerCommission,
    retry: false,
    onSuccess: invalidateWallets,
  });
}
