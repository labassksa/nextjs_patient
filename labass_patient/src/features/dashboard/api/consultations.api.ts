import { apiClient } from "@/lib/api/client";
import type { Consultation, SendFollowUpPayload } from "../types/consultation.types";

export async function getConsultations(): Promise<Consultation[]> {
  const { data } = await apiClient.get("/all-consultations");
  return data;
}

export async function sendFollowUp(payload: SendFollowUpPayload) {
  const { data } = await apiClient.post("/follow-up-magic-link", payload);
  return data;
}
