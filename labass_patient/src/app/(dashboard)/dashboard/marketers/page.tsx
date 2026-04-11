"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { useMarketers } from "@/features/dashboard/hooks/use-marketers";
import type { Marketer } from "@/features/dashboard/types/marketer.types";
import { DataTable } from "@/features/dashboard/components/shared/data-table";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { SearchInput } from "@/features/dashboard/components/shared/search-input";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";

export default function MarketersPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useMarketers();
  const [search, setSearch] = useState("");

  const handleSearch = useCallback((value: string) => setSearch(value), []);

  const columns: ColumnDef<Marketer>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">#{row.original.id}</span>
      ),
    },
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => {
        const m = row.original;
        const first = m.user?.firstName ?? m.firstName;
        const last = m.user?.lastName ?? m.lastName;
        return <span className="font-medium">{first} {last}</span>;
      },
    },
    {
      id: "organization",
      header: "Organization",
      cell: ({ row }) => (
        row.original.organization?.name ? (
          <Badge variant="outline" className="font-normal">{row.original.organization.name}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      ),
    },
    {
      id: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span className="font-mono text-sm" dir="ltr">
          {row.original.user?.phoneNumber ?? row.original.phoneNumber}
        </span>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.original.user?.email ?? row.original.email;
        return email ? (
          <span className="text-sm" dir="ltr">{email}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    { accessorKey: "nationality", header: "Nationality" },
    {
      accessorKey: "promoCodes",
      header: "Promo Codes",
      cell: ({ row }) => {
        const count = row.original.promoCodes?.length || 0;
        return (
          <Badge variant={count > 0 ? "default" : "secondary"} className="font-mono">
            {count}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => router.push(`/dashboard/marketers/${row.original.id}`)}
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
      ),
    },
  ];

  if (error) return <ErrorState onRetry={() => refetch()} />;

  const marketers = Array.isArray(data) ? data : [];

  return (
    <div>
      <PageHeader
        title="Marketers"
        description="Manage marketers and their promo codes"
        actions={
          <Button onClick={() => router.push("/dashboard/marketers/new")}>
            <Plus className="h-4 w-4 mr-2" /> Add Marketer
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput placeholder="Search by name..." onChange={handleSearch} className="max-w-sm" />
      </div>

      <DataTable
        columns={columns}
        data={marketers}
        isLoading={isLoading}
        searchValue={search}
        exportFilename="marketers"
      />
    </div>
  );
}
