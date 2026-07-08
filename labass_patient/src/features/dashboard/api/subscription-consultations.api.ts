import { apiClient } from "@/lib/api/client";
import type {
  AdminSubscriptionConsultationsResponse,
  SubscriptionConsultationsParams,
  SubscriptionConsultationsVariant,
} from "../types/subscription-consultation.types";

function buildQuery(params: SubscriptionConsultationsParams): string {
  const { bundleType, subscriptionId, fromDate, toDate, page = 1, limit = 20 } = params;
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (bundleType) qs.set("bundleType", bundleType);
  if (subscriptionId) qs.set("subscriptionId", String(subscriptionId));
  // fromDate and toDate must be sent together — one alone is ignored by the API.
  if (fromDate && toDate) {
    qs.set("fromDate", fromDate);
    qs.set("toDate", toDate);
  }
  return qs.toString();
}

/**
 * Admin subscription-consultations list.
 *   variant "organizations" -> GET /admin/subscription-consultations/organizations
 *   variant "individuals"   -> GET /admin/subscription-consultations/individuals
 */
export async function getSubscriptionConsultations(
  variant: SubscriptionConsultationsVariant,
  params: SubscriptionConsultationsParams
): Promise<AdminSubscriptionConsultationsResponse> {
  const { data } = await apiClient.get(
    `/admin/subscription-consultations/${variant}?${buildQuery(params)}`
  );
  return data.data;
}
