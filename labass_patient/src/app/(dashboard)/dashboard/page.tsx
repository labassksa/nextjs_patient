"use client";

import { useConsultations } from "@/features/dashboard/hooks/use-consultations";
import { useDoctors } from "@/features/dashboard/hooks/use-doctors";
import { useOrganizations } from "@/features/dashboard/hooks/use-organizations";
import { useMarketers } from "@/features/dashboard/hooks/use-marketers";
import { KpiCard } from "@/features/dashboard/components/shared/kpi-card";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { StatusBadge } from "@/features/dashboard/components/shared/status-badge";
import { CardsSkeleton } from "@/features/dashboard/components/shared/loading-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Stethoscope, ClipboardList, Building2, Megaphone } from "lucide-react";
import type { Consultation } from "@/features/dashboard/types/consultation.types";

export default function DashboardOverviewPage() {
  const { data: consultations, isLoading: loadingConsultations } = useConsultations();
  const { data: doctors, isLoading: loadingDoctors } = useDoctors();
  const { data: organizations, isLoading: loadingOrgs } = useOrganizations();
  const { data: marketers, isLoading: loadingMarketers } = useMarketers();

  const isLoading = loadingConsultations || loadingDoctors || loadingOrgs || loadingMarketers;

  const consultationList: Consultation[] = Array.isArray(consultations) ? consultations : [];
  const doctorList = Array.isArray(doctors) ? doctors : [];
  const orgList = Array.isArray(organizations) ? organizations : [];
  const marketerList = Array.isArray(marketers) ? marketers : [];

  const recentConsultations = consultationList
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Overview" description="Key metrics and recent activity" />

      {isLoading ? (
        <CardsSkeleton count={5} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            title="Total Consultations"
            value={consultationList.length}
            icon={ClipboardList}
          />
          <KpiCard
            title="Doctors"
            value={doctorList.length}
            icon={Stethoscope}
          />
          <KpiCard
            title="Organizations"
            value={orgList.length}
            icon={Building2}
          />
          <KpiCard
            title="Marketers"
            value={marketerList.length}
            icon={Megaphone}
          />
          <KpiCard
            title="Total Promo Codes"
            value={marketerList.reduce((sum, m) => sum + (m.promoCodes?.length || 0), 0)}
            icon={Users}
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Consultations</CardTitle>
        </CardHeader>
        <CardContent>
          {recentConsultations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentConsultations.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.patientName}</TableCell>
                    <TableCell>{c.doctorName}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              {isLoading ? "Loading..." : "No consultations found"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
