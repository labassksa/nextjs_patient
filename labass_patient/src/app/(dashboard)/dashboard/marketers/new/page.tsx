"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateMarketer } from "@/features/dashboard/hooks/use-marketers";
import { useOrganizations } from "@/features/dashboard/hooks/use-organizations";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  // Required by backend validation
  phoneNumber: z.string().regex(/^\+\d{1,3}\d{7,14}$/, "Invalid phone (e.g. +966XXXXXXXXX)"),
  firstName: z.string().min(1, "First name is required").trim(),
  nationality: z.string().min(1, "Nationality is required").trim(),
  organizationId: z.number().min(1, "Organization is required"),
  // Optional fields
  lastName: z.string().trim().optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  gender: z.enum(["male", "female"]).optional(),
  dateOfBirth: z.string().optional().or(z.literal("")),
  nationalId: z.string().regex(/^\d{10}$/, "National ID must be exactly 10 digits").optional().or(z.literal("")),
  iban: z.string().regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/, "Invalid IBAN format (e.g. SA...)").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function CreateMarketerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledOrgId = Number(searchParams.get("organizationId")) || 0;
  const createMarketer = useCreateMarketer();
  const { data: organizations } = useOrganizations();

  const orgsList = Array.isArray(organizations) ? organizations : [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phoneNumber: "", firstName: "", lastName: "", email: "",
      gender: undefined,
      dateOfBirth: "", nationalId: "", iban: "", nationality: "",
      organizationId: prefilledOrgId,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createMarketer.mutateAsync({
        phoneNumber: values.phoneNumber,
        firstName: values.firstName,
        lastName: values.lastName || "",
        email: values.email || "",
        gender: values.gender || "",
        dateOfBirth: values.dateOfBirth || "",
        nationalId: values.nationalId || "",
        iban: values.iban || "",
        nationality: values.nationality,
        organizationId: values.organizationId,
        role: ["marketer"],
      });
      if (prefilledOrgId) {
        router.push(`/dashboard/organizations/${prefilledOrgId}`);
      } else {
        router.push("/dashboard/marketers");
      }
    } catch {
      // handled
    }
  };

  const selectedOrgName = prefilledOrgId
    ? orgsList.find((o) => o.id === prefilledOrgId)?.name
    : null;

  return (
    <div>
      <PageHeader
        title="Add Marketer"
        description={selectedOrgName ? `Adding marketer to ${selectedOrgName}` : "Create a new marketer profile"}
      />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Required fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
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
                  <FormLabel>Phone *</FormLabel>
                  <FormControl><Input {...field} placeholder="+966XXXXXXXXX" dir="ltr" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="nationality" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="organizationId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization *</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      defaultValue={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {orgsList.map((org) => (
                          <SelectItem key={org.id} value={String(org.id)}>
                            {org.name} — {org.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Optional fields */}
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input {...field} type="email" dir="ltr" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="gender" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl><Input {...field} type="date" dir="ltr" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="nationalId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID</FormLabel>
                    <FormControl><Input {...field} dir="ltr" /></FormControl>
                    <FormDescription>10 digits</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="iban" render={({ field }) => (
                  <FormItem>
                    <FormLabel>IBAN</FormLabel>
                    <FormControl><Input {...field} dir="ltr" placeholder="SA..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={createMarketer.isPending}>
                  {createMarketer.isPending ? "Creating..." : "Create Marketer"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
