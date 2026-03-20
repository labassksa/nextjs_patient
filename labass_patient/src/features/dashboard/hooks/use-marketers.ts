import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import {
  getMarketers,
  createMarketer,
  updateMarketer,
  sendMessageToMarketer,
  sendPromoCodesToMarketer,
} from "../api/marketers.api";
import type { CreateMarketerPayload, UpdateMarketerPayload } from "../types/marketer.types";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marketers.all });
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
