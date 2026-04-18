"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { useDoctors } from "@/features/dashboard/hooks/use-doctors";
import type { Doctor } from "@/features/dashboard/types/doctor.types";
import { DataTable } from "@/features/dashboard/components/shared/data-table";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { StatusBadge } from "@/features/dashboard/components/shared/status-badge";
import { SearchInput } from "@/features/dashboard/components/shared/search-input";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";

export default function DoctorsPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useDoctors();
  const [search, setSearch] = useState("");

  const handleSearch = useCallback((value: string) => setSearch(value), []);

  const columns: ColumnDef<Doctor>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: "firstName",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.firstName} {row.original.lastName}</span>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => (
        <span className="font-mono text-sm" dir="ltr">{row.original.phoneNumber}</span>
      ),
    },
    {
      accessorKey: "specialty",
      header: "Specialty",
      cell: ({ row }) => (
        <StatusBadge status={row.original.specialty || "—"} />
      ),
    },
    {
      accessorKey: "medicalLicenseNumber",
      header: "License #",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.medicalLicenseNumber}</span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.isActive ? "Active" : "Inactive"} />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => router.push(`/dashboard/doctors/${row.original.userId || row.original.id}`)}
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
      ),
    },
  ];

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const doctors = Array.isArray(data) ? data : [];

  return (
    <div>
      <PageHeader
        title="Doctors"
        description="Manage doctor profiles"
        actions={
          <Button onClick={() => router.push("/dashboard/doctors/new")}>
            <Plus className="h-4 w-4 mr-2" /> Add Doctor
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput
          placeholder="Search by name..."
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>

      <DataTable
        columns={columns}
        data={doctors}
        isLoading={isLoading}
        searchKey="firstName"
        searchValue={search}
        exportFilename="doctors"
      />
    </div>
  );
}
