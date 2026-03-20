import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import {
  getMarketerPromoCodes,
  generatePromoCode,
  togglePromoCode,
  updatePromoCode,
  resetPromoUsageCount,
  resetMarketerPromoUsageCount,
  resetOrgPromoUsageCount,
} from "../api/promo-codes.api";
import type {
  GeneratePromoCodePayload,
  TogglePromoCodePayload,
  UpdatePromoCodePayload,
  ResetPromoUsagePayload,
  ResetMarketerPromoUsagePayload,
  ResetOrgPromoUsagePayload,
} from "../types/promo-code.types";

export function useMarketerPromoCodes(marketerId: number) {
  return useQuery({
    queryKey: queryKeys.marketers.promoCodes(marketerId),
    queryFn: () => getMarketerPromoCodes(marketerId),
    enabled: !!marketerId,
  });
}

export function useGeneratePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GeneratePromoCodePayload) => generatePromoCode(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marketers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.promoCodes.all });
    },
  });
}

export function useTogglePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TogglePromoCodePayload) => togglePromoCode(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marketers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.promoCodes.all });
    },
  });
}

export function useUpdatePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePromoCodePayload) => updatePromoCode(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marketers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.promoCodes.all });
    },
  });
}

export function useResetPromoUsage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ResetPromoUsagePayload) => resetPromoUsageCount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marketers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.promoCodes.all });
    },
  });
}

export function useResetMarketerPromoUsage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ResetMarketerPromoUsagePayload) => resetMarketerPromoUsageCount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marketers.all });
    },
  });
}

export function useResetOrgPromoUsage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ResetOrgPromoUsagePayload) => resetOrgPromoUsageCount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
    },
  });
}
