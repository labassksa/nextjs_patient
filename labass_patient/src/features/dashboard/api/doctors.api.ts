import { apiClient } from "@/lib/api/client";
import type { Doctor, CreateDoctorPayload, UpdateDoctorPayload } from "../types/doctor.types";

function flattenDoctor(d: any): Doctor {
  const { user, ...doctorFields } = d;
  return {
    ...user,
    ...doctorFields,
    userId: user?.id,
  };
}

export async function getDoctors(): Promise<Doctor[]> {
  const { data } = await apiClient.get("/doctors");
  return Array.isArray(data) ? data.map(flattenDoctor) : data;
}

export async function getDoctorById(id: number): Promise<Doctor> {
  const { data } = await apiClient.get(`/doctors/${id}`);
  return data?.user ? flattenDoctor(data) : data;
}

export async function createDoctor(payload: CreateDoctorPayload) {
  const { data } = await apiClient.post("/doctor", payload);
  return data;
}

export async function updateDoctor(payload: UpdateDoctorPayload) {
  const { data } = await apiClient.put("/doctor", payload);
  return data;
}
