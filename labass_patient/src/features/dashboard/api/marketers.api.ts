import { apiClient } from "@/lib/api/client";
import type { Marketer, CreateMarketerPayload, UpdateMarketerPayload } from "../types/marketer.types";

export async function getMarketers(): Promise<Marketer[]> {
  const { data } = await apiClient.get("/marketers");
  return data;
}

export async function createMarketer(payload: CreateMarketerPayload) {
  const { data } = await apiClient.post("/marketer", payload);
  return data;
}

export async function updateMarketer(payload: UpdateMarketerPayload) {
  const { data } = await apiClient.put("/marketers", payload);
  return data;
}

export async function sendMessageToMarketer(marketerId: number, message: string) {
  const { data } = await apiClient.post("/marketers/send-message", { marketerId, message });
  return data;
}

export async function sendPromoCodesToMarketer(marketerId: number) {
  const { data } = await apiClient.post("/send-promoCodes-to-marketer", { marketerId });
  return data;
}
