import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  getOrganizationConsultations,
} from "../api/organizations.api";
import type { CreateOrganizationPayload, UpdateOrganizationPayload } from "../types/organization.types";

export function useOrganizations() {
  return useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: getOrganizations,
  });
}

export function useOrganizationConsultations(orgId: number) {
  return useQuery({
    queryKey: queryKeys.organizations.consultations(orgId),
    queryFn: () => getOrganizationConsultations(orgId),
    enabled: !!orgId,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) => createOrganization(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateOrganizationPayload) => updateOrganization(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
    },
  });
}
