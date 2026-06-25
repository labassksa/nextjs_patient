import { apiClient } from "@/lib/api/client";
import type { CreateSubscriptionPayload, UpdateSubscriptionPayload, ReferralReportParams, ReferralReportResponse } from "../types/subscription.types";

export async function getSubscriptions() {
  const { data } = await apiClient.get("/admin/subscriptions");
  return data?.data ?? data;
}

export async function createSubscription(payload: CreateSubscriptionPayload) {
  const { data } = await apiClient.post("/admin/subscriptions", payload);
  return data;
}

export async function updateSubscription(id: number, payload: UpdateSubscriptionPayload) {
  const { data } = await apiClient.put(`/admin/subscriptions/${id}`, payload);
  return data;
}

export async function toggleSubscriptionStatus(id: number) {
  const { data } = await apiClient.patch(`/admin/subscriptions/${id}/toggle-status`);
  return data;
}

export async function cancelSubscription(id: number) {
  const { data } = await apiClient.patch(`/admin/subscriptions/${id}/cancel`);
  return data;
}

export async function getReferralReport(params: ReferralReportParams): Promise<ReferralReportResponse> {
  const qs = new URLSearchParams();
  if (params.fromDate) qs.set("fromDate", params.fromDate);
  if (params.toDate) qs.set("toDate", params.toDate);
  if (params.organizationId) qs.set("organizationId", String(params.organizationId));
  if (params.marketerId) qs.set("marketerId", String(params.marketerId));
  if (params.status) qs.set("status", params.status);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const { data } = await apiClient.get(`/admin/subscriptions/referral-report?${qs}`);
  return data;
}
