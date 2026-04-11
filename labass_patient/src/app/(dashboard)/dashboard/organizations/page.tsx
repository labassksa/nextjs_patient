"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { useOrganizations } from "@/features/dashboard/hooks/use-organizations";
import type { Organization } from "@/features/dashboard/types/organization.types";
import { DataTable } from "@/features/dashboard/components/shared/data-table";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { StatusBadge } from "@/features/dashboard/components/shared/status-badge";
import { SearchInput } from "@/features/dashboard/components/shared/search-input";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";

export default function OrganizationsPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useOrganizations();
  const [search, setSearch] = useState("");

  const handleSearch = useCallback((value: string) => setSearch(value), []);

  const columns: ColumnDef<Organization>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <StatusBadge status={row.getValue("type")} />,
    },
    { accessorKey: "city", header: "City" },
    {
      accessorKey: "numberOfBranches",
      header: "Branches",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">{row.original.numberOfBranches}</Badge>
      ),
    },
    {
      accessorKey: "dealType",
      header: "Deal Type",
      cell: ({ row }) => <StatusBadge status={row.original.dealType} />,
    },
    {
      accessorKey: "organizationManagerName",
      header: "Manager",
      cell: ({ row }) => row.original.organizationManagerName || "—",
    },
    {
      accessorKey: "phoneNumber",
      header: "Manager Phone",
      cell: ({ row }) => row.original.phoneNumber ? (
        <span className="font-mono text-sm" dir="ltr">{row.original.phoneNumber}</span>
      ) : "—",
    },
    {
      accessorKey: "marketers",
      header: "Marketers",
      cell: ({ row }) => {
        const count = row.original.marketers?.length || 0;
        return (
          <Badge variant={count > 0 ? "default" : "secondary"} className="font-mono">
            {count}
          </Badge>
        );
      },
    },
    {
      accessorKey: "consultationCountLast30Days",
      header: "Consultations (30d)",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">
          {row.original.consultationCountLast30Days ?? 0}
        </Badge>
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
          onClick={() => router.push(`/dashboard/organizations/${row.original.id}`)}
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
      ),
    },
  ];

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const organizations = Array.isArray(data) ? data : [];

  return (
    <div>
      <PageHeader
        title="Organizations"
        description="Manage organizations and their marketers"
        actions={
          <Button onClick={() => router.push("/dashboard/organizations/new")}>
            <Plus className="h-4 w-4 mr-2" /> Add Organization
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput placeholder="Search by name..." onChange={handleSearch} className="max-w-sm" />
      </div>

      <DataTable
        columns={columns}
        data={organizations}
        isLoading={isLoading}
        searchKey="name"
        searchValue={search}
        exportFilename="organizations"
      />
    </div>
  );
}
