import { apiClient } from "@/lib/api/client";
import type { Doctor, CreateDoctorPayload, UpdateDoctorPayload } from "../types/doctor.types";

export async function getDoctors(): Promise<Doctor[]> {
  const { data } = await apiClient.get("/doctors");
  return data;
}

export async function getDoctorById(id: number): Promise<Doctor> {
  const { data } = await apiClient.get(`/doctors/${id}`);
  return data;
}

export async function createDoctor(payload: CreateDoctorPayload) {
  const { data } = await apiClient.post("/doctor", payload);
  return data;
}

export async function updateDoctor(payload: UpdateDoctorPayload) {
  const { data } = await apiClient.put("/doctor", payload);
  return data;
}
