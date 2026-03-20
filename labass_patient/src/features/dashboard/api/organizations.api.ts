import { apiClient } from "@/lib/api/client";
import type { Organization, CreateOrganizationPayload, UpdateOrganizationPayload } from "../types/organization.types";
import type { Consultation } from "../types/consultation.types";

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

export async function getOrganizationConsultations(orgId: number): Promise<Consultation[]> {
  const { data } = await apiClient.get("/consultations/get-by-org", {
    params: { orgId },
  });
  return data;
}
