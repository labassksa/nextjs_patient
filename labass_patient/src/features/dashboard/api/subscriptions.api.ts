import { apiClient } from "@/lib/api/client";
import type { CreateSubscriptionPayload, UpdateSubscriptionPayload } from "../types/subscription.types";

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
