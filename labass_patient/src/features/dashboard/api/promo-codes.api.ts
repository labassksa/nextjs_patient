import { apiClient } from "@/lib/api/client";
import type {
  GeneratePromoCodePayload,
  TogglePromoCodePayload,
  UpdatePromoCodePayload,
  ResetPromoUsagePayload,
  ResetMarketerPromoUsagePayload,
  ResetOrgPromoUsagePayload,
} from "../types/promo-code.types";

export async function getMarketerPromoCodes(marketerId: number) {
  const { data } = await apiClient.get(`/marketers/${marketerId}/promocodes`);
  return data;
}

export async function generatePromoCode(payload: GeneratePromoCodePayload) {
  const { data } = await apiClient.post("/generate-promotional-code", payload);
  return data;
}

export async function togglePromoCode(payload: TogglePromoCodePayload) {
  const { data } = await apiClient.patch("/promotional-code/activate-deactivate", payload);
  return data;
}

export async function updatePromoCode(payload: UpdatePromoCodePayload) {
  const { data } = await apiClient.put("/promotional-code", payload);
  return data;
}

export async function resetPromoUsageCount(payload: ResetPromoUsagePayload) {
  const { data } = await apiClient.post("/promotional-code-reset-count", payload);
  return data;
}

export async function resetMarketerPromoUsageCount(payload: ResetMarketerPromoUsagePayload) {
  const { data } = await apiClient.post("/marketer-promotional-code-reset-count", payload);
  return data;
}

export async function resetOrgPromoUsageCount(payload: ResetOrgPromoUsagePayload) {
  const { data } = await apiClient.post("/organization-promotional-code-reset-count", payload);
  return data;
}
