"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDoctor, useUpdateDoctor } from "@/features/dashboard/hooks/use-doctors";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { StatusBadge } from "@/features/dashboard/components/shared/status-badge";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { FormSkeleton } from "@/features/dashboard/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

const updateDoctorSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  phoneNumber: z.string().regex(/^\+\d{1,3}\d{7,14}$/, "Invalid phone (e.g. +966XXXXXXXXX)"),
  nationality: z.string().optional(),
  specialty: z.string().min(1, "Specialty is required"),
  medicalLicenseNumber: z.string().min(1, "License number is required"),
  iban: z.string().regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/, "Invalid IBAN format").or(z.literal("")),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof updateDoctorSchema>;

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = Number(params.id);
  const { data: doctor, isLoading, error, refetch } = useDoctor(doctorId);
  const updateDoctor = useUpdateDoctor();

  const form = useForm<FormValues>({
    resolver: zodResolver(updateDoctorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      nationality: "",
      specialty: "",
      medicalLicenseNumber: "",
      iban: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (doctor) {
      form.reset({
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        phoneNumber: doctor.phoneNumber || "",
        nationality: doctor.nationality || "",
        specialty: doctor.specialty || "",
        medicalLicenseNumber: doctor.medicalLicenseNumber || "",
        iban: doctor.iban || "",
        isActive: doctor.isActive ?? true,
      });
    }
  }, [doctor, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateDoctor.mutateAsync({
        doctorId: doctor?.id || doctorId,
        doctor: {
          specialty: values.specialty,
          iban: values.iban,
          medicalLicenseNumber: values.medicalLicenseNumber,
          isActive: values.isActive,
        },
        user: {
          phoneNumber: values.phoneNumber,
          firstName: values.firstName,
          lastName: values.lastName,
          nationality: values.nationality,
        },
      });
      router.push("/dashboard/doctors");
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) return <FormSkeleton fields={6} />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader
        title={`Doctor: ${doctor?.firstName || ""} ${doctor?.lastName || ""}`}
        description="View and edit doctor details"
        actions={<StatusBadge status={doctor?.isActive ? "Active" : "Inactive"} />}
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Doctor</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input {...field} dir="ltr" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="specialty" render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="General Practice">General Practice</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                      <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="medicalLicenseNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical License Number</FormLabel>
                  <FormControl><Input {...field} dir="ltr" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="iban" render={({ field }) => (
                <FormItem>
                  <FormLabel>IBAN</FormLabel>
                  <FormControl><Input {...field} dir="ltr" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>Active Status</FormLabel>
                    <p className="text-sm text-muted-foreground">Enable or disable this doctor</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={updateDoctor.isPending}>
                  {updateDoctor.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
