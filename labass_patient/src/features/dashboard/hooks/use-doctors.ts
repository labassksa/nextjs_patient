import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import { getDoctors, getDoctorById, createDoctor, updateDoctor } from "../api/doctors.api";
import type { CreateDoctorPayload, UpdateDoctorPayload } from "../types/doctor.types";

export function useDoctors() {
  return useQuery({
    queryKey: queryKeys.doctors.all,
    queryFn: getDoctors,
  });
}

export function useDoctor(id: number) {
  return useQuery({
    queryKey: queryKeys.doctors.detail(id),
    queryFn: () => getDoctorById(id),
    enabled: !!id,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDoctorPayload) => createDoctor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all });
    },
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateDoctorPayload) => updateDoctor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all });
    },
  });
}
