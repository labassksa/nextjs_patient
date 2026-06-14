import { apiClient } from "@/lib/api/client";
import type { Organization, CreateOrganizationPayload, UpdateOrganizationPayload, OrgReportResponse, SubscriptionConsultationsResponse } from "../types/organization.types";

export async function getOrganizations(): Promise<Organization[]> {
  const { data } = await apiClient.get("/organizations/with-marketers");
  return data;
}

export async function createOrganization(payload: CreateOrganizationPayload) {
  const { data } = await apiClient.post("/organizations", payload);
  return data;
}

export async function updateOrganization(payload: UpdateOrganizationPayload) {
  const { data } = await apiClient.put("/organizations", payload);
  return data;
}

export async function getOrgSubscriptionConsultations(
  organizationId: number,
  params: { bundleType?: string; subscriptionId?: number; fromDate?: string; toDate?: string; page?: number; limit?: number }
): Promise<SubscriptionConsultationsResponse> {
  const { bundleType, subscriptionId, fromDate, toDate, page = 1, limit = 20 } = params;
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (bundleType) qs.set("bundleType", bundleType);
  if (subscriptionId) qs.set("subscriptionId", String(subscriptionId));
  if (fromDate && toDate) { qs.set("fromDate", fromDate); qs.set("toDate", toDate); }
  const { data } = await apiClient.get(
    `/admin/organizations/${organizationId}/subscription-consultations?${qs}`
  );
  return data.data;
}

export async function getOrgConsultationsReport(
  orgId: number,
  fromDate: string,
  toDate: string,
  page: number = 1,
  limit: number = 10
): Promise<OrgReportResponse> {
  const { data } = await apiClient.post("/marketers/consultations/report", { orgId, fromDate, toDate, page, limit });
  return data;
}
