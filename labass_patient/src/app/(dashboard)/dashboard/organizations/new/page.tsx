"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateOrganization } from "@/features/dashboard/hooks/use-organizations";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const KSA_CITIES = [
  "Riyadh", "Jeddah", "Mecca", "Medina", "Dammam",
  "Khobar", "Dhahran", "Tabuk", "Abha", "Taif",
  "Buraidah", "Khamis Mushait", "Hail", "Najran", "Jubail",
  "Yanbu", "Al Ahsa", "Jazan", "Al Baha", "Arar",
  "Sakaka", "Qatif", "Unaizah", "Hafar Al Batin",
] as const;

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  iban: z.string().regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/, "Invalid IBAN format (e.g. SA...)"),
  city: z.string().min(1, "City is required"),
  numberOfBranches: z.number().min(1, "Must have at least 1 branch"),
  type: z.enum(["pharmacy", "laboratory", "home care", "school"], { message: "Type is required" }),
  dealType: z.enum(["SUBSCRIPTION", "REVENUE_SHARE"], { message: "Deal type is required" }),
});

type FormValues = z.infer<typeof schema>;

export default function CreateOrganizationPage() {
  const router = useRouter();
  const createOrg = useCreateOrganization();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", iban: "", city: "", numberOfBranches: 1, type: undefined as unknown as "pharmacy" | "laboratory" | "home care" | "school", dealType: undefined as unknown as "SUBSCRIPTION" | "REVENUE_SHARE" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createOrg.mutateAsync(values);
      router.push("/dashboard/organizations");
    } catch {
      // handled by mutation
    }
  };

  return (
    <div>
      <PageHeader title="Add Organization" description="Create a new organization" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="laboratory">Laboratory</SelectItem>
                        <SelectItem value="home care">Home Care</SelectItem>
                        <SelectItem value="school">School</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dealType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select deal type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                        <SelectItem value="REVENUE_SHARE">Revenue Share</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {KSA_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="numberOfBranches" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Branches</FormLabel>
                    <FormControl><Input value={field.value} onChange={(e) => field.onChange(Number(e.target.value) || 0)} type="number" min={1} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="iban" render={({ field }) => (
                <FormItem>
                  <FormLabel>IBAN</FormLabel>
                  <FormControl><Input {...field} dir="ltr" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={createOrg.isPending}>
                  {createOrg.isPending ? "Creating..." : "Create Organization"}
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
