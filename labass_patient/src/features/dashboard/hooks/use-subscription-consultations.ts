import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import { getSubscriptionConsultations } from "../api/subscription-consultations.api";
import type {
  SubscriptionConsultationsParams,
  SubscriptionConsultationsVariant,
} from "../types/subscription-consultation.types";

export function useSubscriptionConsultations(
  variant: SubscriptionConsultationsVariant,
  params: SubscriptionConsultationsParams
) {
  return useQuery({
    queryKey: queryKeys.subscriptionConsultations.list(variant, params),
    queryFn: () => getSubscriptionConsultations(variant, params),
    // Keep the current page visible while the next one loads (smoother paging).
    placeholderData: keepPreviousData,
  });
}
