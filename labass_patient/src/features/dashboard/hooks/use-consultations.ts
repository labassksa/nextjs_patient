import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import { getConsultationReport, getConsultations, sendFollowUp } from "../api/consultations.api";
import type { ConsultationReportParams, SendFollowUpPayload } from "../types/consultation.types";

export function useConsultations() {
  return useQuery({
    queryKey: queryKeys.consultations.all,
    queryFn: getConsultations,
  });
}

export function useConsultationReport(params: ConsultationReportParams) {
  return useQuery({
    queryKey: queryKeys.consultations.report(params),
    queryFn: () => getConsultationReport(params),
  });
}

export function useConsultationsReport(fromDate?: string, toDate?: string, page: number = 1, limit: number = 10) {
  return useConsultationReport({ fromDate, toDate, page, limit });
}

export function useSendFollowUp() {
  return useMutation({
    mutationFn: (payload: SendFollowUpPayload) => sendFollowUp(payload),
  });
}
