import { apiClient } from "@/lib/api/client";
import type { Consultation, SendFollowUpPayload } from "../types/consultation.types";
import type { OrgReportResponse } from "../types/organization.types";

export async function getConsultations(): Promise<Consultation[]> {
  const { data } = await apiClient.get("/all-consultations");
  return data;
}

export async function getConsultationsReport(fromDate: string, toDate: string, page: number = 1, limit: number = 10): Promise<OrgReportResponse> {
  const { data } = await apiClient.post("/marketers/consultations/report", { fromDate, toDate, page, limit });
  return data;
}

export async function sendFollowUp(payload: SendFollowUpPayload) {
  const { data } = await apiClient.post("/follow-up-magic-link", payload);
  return data;
}
