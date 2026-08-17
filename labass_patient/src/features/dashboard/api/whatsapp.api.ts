import { apiClient } from "@/lib/api/client";
import type {
  TestMessagePayload,
  TestMessageResponse,
  WhatsAppActionResponse,
  WhatsAppQr,
  WhatsAppStatus,
} from "../types/whatsapp.types";

export async function getWhatsAppStatus(): Promise<WhatsAppStatus> {
  const { data } = await apiClient.get<WhatsAppStatus>("/admin/whatsapp/status");
  return data;
}

export async function getWhatsAppQr(): Promise<WhatsAppQr> {
  const { data } = await apiClient.get<WhatsAppQr>("/admin/whatsapp/qr");
  return data;
}

export async function logoutWhatsApp(): Promise<WhatsAppActionResponse> {
  const { data } = await apiClient.post<WhatsAppActionResponse>(
    "/admin/whatsapp/logout"
  );
  return data;
}

export async function reconnectWhatsApp(): Promise<WhatsAppActionResponse> {
  const { data } = await apiClient.post<WhatsAppActionResponse>(
    "/admin/whatsapp/reconnect"
  );
  return data;
}

export async function sendWhatsAppTestMessage(
  payload: TestMessagePayload
): Promise<TestMessageResponse> {
  const { data } = await apiClient.post<TestMessageResponse>(
    "/admin/whatsapp/test-message",
    payload
  );
  return data;
}
