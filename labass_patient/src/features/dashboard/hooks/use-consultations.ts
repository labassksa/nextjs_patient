import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import { getConsultations, getConsultationsReport, sendFollowUp } from "../api/consultations.api";
import type { SendFollowUpPayload } from "../types/consultation.types";

export function useConsultations() {
  return useQuery({
    queryKey: queryKeys.consultations.all,
    queryFn: getConsultations,
  });
}

export function useConsultationsReport(fromDate: string, toDate: string) {
  return useQuery({
    queryKey: queryKeys.consultations.report(fromDate, toDate),
    queryFn: () => getConsultationsReport(fromDate, toDate),
    enabled: !!fromDate && !!toDate,
  });
}

export function useSendFollowUp() {
  return useMutation({
    mutationFn: (payload: SendFollowUpPayload) => sendFollowUp(payload),
  });
}
