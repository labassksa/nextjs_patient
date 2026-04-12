import { apiClient } from "@/lib/api/client";
import type { Bundle, CreateBundlePayload, UpdateBundlePayload } from "../types/bundle.types";

export async function getBundles(): Promise<Bundle[]> {
  const { data } = await apiClient.get("/bundles");
  return data?.data ?? data;
}

export async function createBundle(payload: CreateBundlePayload) {
  const { data } = await apiClient.post("/bundles", payload);
  return data;
}

export async function updateBundle(id: number, payload: UpdateBundlePayload) {
  const { data } = await apiClient.put(`/bundles/${id}`, payload);
  return data;
}

export async function toggleBundleActive(id: number) {
  const { data } = await apiClient.patch(`/bundles/${id}/toggle-active`);
  return data;
}

export async function deleteBundle(id: number) {
  const { data } = await apiClient.delete(`/bundles/${id}`);
  return data;
}
