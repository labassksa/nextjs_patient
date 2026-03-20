"use client";

import { useState, useCallback, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useMarketers } from "@/features/dashboard/hooks/use-marketers";
import { useTogglePromoCode, useResetPromoUsage } from "@/features/dashboard/hooks/use-promo-codes";
import type { PromoCode } from "@/features/dashboard/types/marketer.types";
import { DataTable } from "@/features/dashboard/components/shared/data-table";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { StatusBadge } from "@/features/dashboard/components/shared/status-badge";
import { SearchInput } from "@/features/dashboard/components/shared/search-input";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RefreshCw } from "lucide-react";

interface PromoCodeWithMarketer extends PromoCode {
  marketerName: string;
  marketerId: number;
}

export default function PromoCodesPage() {
  const { data: marketers, isLoading, error, refetch } = useMarketers();
  const togglePromo = useTogglePromoCode();
  const resetUsage = useResetPromoUsage();
  const [search, setSearch] = useState("");

  const handleSearch = useCallback((value: string) => setSearch(value), []);

  const allPromoCodes: PromoCodeWithMarketer[] = useMemo(() => {
    if (!Array.isArray(marketers)) return [];
    return marketers.flatMap((m) =>
      (m.promoCodes || []).map((pc) => ({
        ...pc,
        marketerName: `${m.firstName} ${m.lastName}`,
        marketerId: m.id,
      }))
    );
  }, [marketers]);

  const columns: ColumnDef<PromoCodeWithMarketer>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono font-medium tracking-wider">
          {row.original.code}
        </Badge>
      ),
    },
    {
      accessorKey: "marketerName",
      header: "Marketer",
      cell: ({ row }) => <span className="font-medium">{row.original.marketerName}</span>,
    },
    {
      accessorKey: "discountPercentage",
      header: "Discount",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">{row.original.discountPercentage}%</span>
      ),
    },
    {
      accessorKey: "marketerPercentage",
      header: "Marketer %",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.marketerPercentage}%</span>
      ),
    },
    {
      accessorKey: "usageCount",
      header: "Usage",
      cell: ({ row }) => (
        <Badge variant={row.original.usageCount > 0 ? "default" : "secondary"} className="font-mono">
          {row.original.usageCount}
        </Badge>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.isActive ? "Active" : "Inactive"} />,
    },
    {
      id: "toggle",
      header: "Toggle",
      cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => togglePromo.mutate({ codeId: row.original.id })}
        />
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
          onClick={() => resetUsage.mutate({ codeId: row.original.id })}
        >
          <RefreshCw className="h-4 w-4 mr-1" /> Reset
        </Button>
      ),
    },
  ];

  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader title="Promo Codes" description="Manage all promo codes across marketers" />

      <div className="mb-4">
        <SearchInput placeholder="Search by code or marketer..." onChange={handleSearch} className="max-w-sm" />
      </div>

      <DataTable
        columns={columns}
        data={allPromoCodes}
        isLoading={isLoading}
        searchKey="code"
        searchValue={search}
      />
    </div>
  );
}
