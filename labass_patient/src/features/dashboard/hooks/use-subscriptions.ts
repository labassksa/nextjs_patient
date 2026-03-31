import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  toggleSubscriptionStatus,
  cancelSubscription,
} from "../api/subscriptions.api";
import type { CreateSubscriptionPayload, UpdateSubscriptionPayload } from "../types/subscription.types";

export function useSubscriptions() {
  return useQuery({
    queryKey: queryKeys.subscriptions.all,
    queryFn: getSubscriptions,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSubscriptionPayload) => createSubscription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSubscriptionPayload }) =>
      updateSubscription(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all });
    },
  });
}

export function useToggleSubscriptionStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => toggleSubscriptionStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all });
    },
  });
}
