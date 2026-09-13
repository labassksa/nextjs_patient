import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import {
  getMarketers,
  createMarketer,
  updateMarketer,
  sendMessageToMarketer,
  sendPromoCodesToMarketer,
  getMarketerConsultations,
} from "../api/marketers.api";
import type { CreateMarketerPayload, Marketer, UpdateMarketerPayload } from "../types/marketer.types";

export function useMarketers() {
  return useQuery({
    queryKey: queryKeys.marketers.all,
    queryFn: getMarketers,
  });
}

export function useCreateMarketer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMarketerPayload) => createMarketer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marketers.all });
    },
  });
}

export function useUpdateMarketer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMarketerPayload) => updateMarketer(payload),
    onSuccess: (updatedMarketer, payload) => {
      queryClient.setQueryData<Marketer[]>(queryKeys.marketers.all, (marketers) =>
        marketers?.map((marketer) =>
          marketer.id === payload.marketerId
            ? {
                ...marketer,
                ...updatedMarketer,
                user: updatedMarketer.user
                  ? { ...marketer.user, ...updatedMarketer.user }
                  : marketer.user,
              }
            : marketer,
        ),
      );
      queryClient.setQueryData(queryKeys.marketers.detail(payload.marketerId), updatedMarketer);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.marketers.all,
        refetchType: "none",
      });
    },
  });
}

export function useSendMessageToMarketer() {
  return useMutation({
    mutationFn: ({ marketerId, message }: { marketerId: number; message: string }) =>
      sendMessageToMarketer(marketerId, message),
  });
}

export function useSendPromoCodesToMarketer() {
  return useMutation({
    mutationFn: (marketerId: number) => sendPromoCodesToMarketer(marketerId),
  });
}

export function useMarketerConsultations(marketerId: number, fromDate: string, toDate: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...queryKeys.marketers.consultations(marketerId, fromDate, toDate), page, limit],
    queryFn: () => getMarketerConsultations(marketerId, fromDate, toDate, page, limit),
    enabled: !!marketerId && !!fromDate && !!toDate,
  });
}
