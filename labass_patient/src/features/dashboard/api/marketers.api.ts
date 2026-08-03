import { apiClient } from "@/lib/api/client";
import type { Marketer, CreateMarketerPayload, UpdateMarketerPayload, MarketerConsultationsResponse } from "../types/marketer.types";
import { getConsultationReport } from "./consultations.api";

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

export async function getMarketerConsultations(marketerId: number, fromDate: string, toDate: string, page: number = 1, limit: number = 10): Promise<MarketerConsultationsResponse> {
  return getConsultationReport({ marketerId, fromDate, toDate, page, limit });
}
