import { apiClient } from "@/lib/api/client";
import type { Organization, CreateOrganizationPayload, UpdateOrganizationPayload, OrgReportResponse } from "../types/organization.types";

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
