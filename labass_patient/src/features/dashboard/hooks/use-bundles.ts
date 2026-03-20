import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import { getBundles, createBundle, updateBundle, toggleBundleActive, deleteBundle } from "../api/bundles.api";
import type { CreateBundlePayload, UpdateBundlePayload } from "../types/bundle.types";

export function useBundles() {
  return useQuery({
    queryKey: queryKeys.bundles.all,
    queryFn: getBundles,
  });
}

export function useCreateBundle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBundlePayload) => createBundle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bundles.all });
    },
  });
}

export function useUpdateBundle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBundlePayload }) => updateBundle(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bundles.all });
    },
  });
}

export function useToggleBundleActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => toggleBundleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bundles.all });
    },
  });
}

export function useDeleteBundle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBundle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bundles.all });
    },
  });
}
