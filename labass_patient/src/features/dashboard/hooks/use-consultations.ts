import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import { getConsultations, sendFollowUp } from "../api/consultations.api";
import type { SendFollowUpPayload } from "../types/consultation.types";

export function useConsultations() {
  return useQuery({
    queryKey: queryKeys.consultations.all,
    queryFn: getConsultations,
  });
}

export function useSendFollowUp() {
  return useMutation({
    mutationFn: (payload: SendFollowUpPayload) => sendFollowUp(payload),
  });
}
