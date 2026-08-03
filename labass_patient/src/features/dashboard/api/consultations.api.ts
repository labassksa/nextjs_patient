import { apiClient } from "@/lib/api/client";
import type {
  Consultation,
  ConsultationReportParams,
  ConsultationReportResponse,
  SearchConsultationsByDrugParams,
  SearchConsultationsByDrugResponse,
  SendFollowUpPayload,
} from "../types/consultation.types";

export async function getConsultations(): Promise<Consultation[]> {
  const { data } = await apiClient.get("/all-consultations");
  return data;
}

export async function getConsultationReport(params: ConsultationReportParams = {}): Promise<ConsultationReportResponse> {
  const payload: ConsultationReportParams = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  };

  if (params.fromDate) payload.fromDate = params.fromDate;
  if (params.toDate) payload.toDate = params.toDate;
  if (params.orgId) {
    payload.orgId = params.orgId;
  } else if (params.marketerId) {
    payload.marketerId = params.marketerId;
  }

  const { data } = await apiClient.post("/marketers/consultations/report", payload);
  return data;
}

export async function getConsultationsReport(fromDate?: string, toDate?: string, page: number = 1, limit: number = 10): Promise<ConsultationReportResponse> {
  return getConsultationReport({ fromDate, toDate, page, limit });
}

export async function searchConsultationsByDrug(params: SearchConsultationsByDrugParams): Promise<SearchConsultationsByDrugResponse> {
  const queryParams: SearchConsultationsByDrugParams = {
    search: params.search.trim(),
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  };

  if (params.fromDate && params.toDate) {
    queryParams.fromDate = params.fromDate;
    queryParams.toDate = params.toDate;
  }

  const { data } = await apiClient.get("/consultations/search-by-drug", {
    params: queryParams,
  });
  return data;
}

export async function sendFollowUp(payload: SendFollowUpPayload) {
  const { data } = await apiClient.post("/follow-up-magic-link", payload);
  return data;
}
