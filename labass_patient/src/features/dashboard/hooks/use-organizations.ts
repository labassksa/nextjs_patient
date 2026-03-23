import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  getOrgConsultationsReport,
} from "../api/organizations.api";
import type { CreateOrganizationPayload, UpdateOrganizationPayload } from "../types/organization.types";

export function useOrganizations() {
  return useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: getOrganizations,
  });
}

export function useOrgConsultationsReport(orgId: number, fromDate: string, toDate: string) {
  return useQuery({
    queryKey: queryKeys.organizations.report(orgId, fromDate, toDate),
    queryFn: () => getOrgConsultationsReport(orgId, fromDate, toDate),
    enabled: !!orgId && !!fromDate && !!toDate,
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
