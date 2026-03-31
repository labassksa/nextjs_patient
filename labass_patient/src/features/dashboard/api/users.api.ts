import { apiClient } from "@/lib/api/client";
import type { User, CreateAdminPayload } from "../types/user.types";

export async function getUsers(): Promise<User[]> {
  const { data } = await apiClient.get("/users");
  return data;
}

export async function createAdminUser(payload: CreateAdminPayload) {
  const { data } = await apiClient.post("/crtAdmnUsr", payload);
  return data;
}
