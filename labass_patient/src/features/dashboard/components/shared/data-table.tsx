"use client";

import { useState, useEffect } from "react";
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type Header,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download } from "lucide-react";
import { TableSkeleton } from "./loading-skeleton";
import { EmptyState } from "./empty-state";

function getHeaderLabel<TData, TValue>(header: Header<TData, TValue>): string {
  const def = header.column.columnDef.header;
  if (typeof def === "string") return def;
  return header.column.id;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  searchKey?: string;
  searchValue?: string;
  emptyMessage?: string;
  pageSize?: number;
  exportFilename?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  searchKey,
  searchValue,
  emptyMessage = "No results found.",
  pageSize = 10,
  exportFilename,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      globalFilter: searchKey ? undefined : (searchValue ?? ""),
    },
    globalFilterFn: "includesString",
    initialState: {
      pagination: { pageSize },
    },
  });

  useEffect(() => {
    if (searchKey && searchValue !== undefined) {
      const column = table.getColumn(searchKey);
      if (column) {
        column.setFilterValue(searchValue || undefined);
      }
    }
  }, [searchKey, searchValue, table]);

  const handleExport = async () => {
    const XLSX = await import("xlsx");
    const filteredRows = table.getFilteredRowModel().rows;
    const headerLabels = table.getHeaderGroups()[0]?.headers
      .map((h) => getHeaderLabel(h))
      .filter((label) => label && label !== "actions" && label !== "toggle") ?? [];

    const rows = filteredRows.map((row) =>
      Object.fromEntries(
        row.getVisibleCells()
          .filter((cell) => {
            const label = getHeaderLabel(
              table.getHeaderGroups()[0]?.headers.find((h) => h.id === cell.column.id)!
            );
            return label && label !== "actions" && label !== "toggle";
          })
          .map((cell) => {
            const label = getHeaderLabel(
              table.getHeaderGroups()[0]?.headers.find((h) => h.id === cell.column.id)!
            );
            const value = cell.getValue();
            return [label, value ?? ""];
          })
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headerLabels });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${exportFilename ?? "export"}.xlsx`);
  };

  if (isLoading) {
    return <TableSkeleton rows={pageSize} columns={columns.length} />;
  }

  const currentPage = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();
  const filteredRows = table.getFilteredRowModel().rows.length;
  const rows = table.getRowModel().rows;
  const headerGroups = table.getHeaderGroups();
  const headers = headerGroups[0]?.headers ?? [];

  return (
    <div>
      {/* Export button */}
      {exportFilename && (
        <div className="flex justify-end mb-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      )}

      {/* Desktop: Table view */}
      <Card className="overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {headerGroups.map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows.length ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <EmptyState title={emptyMessage} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Mobile: Card list view */}
      <div className="md:hidden space-y-3">
        {rows.length ? (
          rows.map((row) => {
            const cells = row.getVisibleCells();
            // Find the action cell (empty header or "actions" id)
            const actionCell = cells.find((cell) => {
              const label = getHeaderLabel(
                headers.find((h) => h.id === cell.column.id)!
              );
              return !label || label === "actions" || label === "toggle";
            });
            // Get the ID cell
            const idCell = cells.find((cell) => cell.column.id === "id");
            // Filter out ID and action columns for the card body
            const contentCells = cells.filter((cell) => {
              const colId = cell.column.id;
              const label = getHeaderLabel(
                headers.find((h) => h.id === colId)!
              );
              return label && label !== "actions" && label !== "toggle" && colId !== "id";
            });
            // Get first cell as the "header" of the card
            const primaryCell = contentCells[0];
            const restCells = contentCells.slice(1);

            return (
              <Card key={row.id} className="p-4">
                {/* Card header: ID + primary field + action */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {idCell && (
                      <span className="text-xs font-mono text-muted-foreground">
                        {flexRender(idCell.column.columnDef.cell, idCell.getContext())}
                      </span>
                    )}
                    <span className="font-medium text-sm">
                      {primaryCell && flexRender(primaryCell.column.columnDef.cell, primaryCell.getContext())}
                    </span>
                  </div>
                  {actionCell && (
                    <div className="shrink-0">
                      {flexRender(actionCell.column.columnDef.cell, actionCell.getContext())}
                    </div>
                  )}
                </div>
                {/* Card body: label-value pairs */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {restCells.map((cell) => {
                    const header = headers.find((h) => h.id === cell.column.id);
                    const label = header ? getHeaderLabel(header) : cell.column.id;
                    return (
                      <div key={cell.id}>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                          {label}
                        </p>
                        <div className="text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-8">
            <EmptyState title={emptyMessage} />
          </Card>
        )}
      </div>

      {/* Pagination Footer */}
      {data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {currentPage * table.getState().pagination.pageSize + 1}
              </span>
              {" "}to{" "}
              <span className="font-medium text-foreground">
                {Math.min(
                  (currentPage + 1) * table.getState().pagination.pageSize,
                  filteredRows
                )}
              </span>
              {" "}of{" "}
              <span className="font-medium text-foreground">{filteredRows}</span>
              {" "}results
            </p>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select
                value={String(table.getState().pagination.pageSize)}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground mr-2">
              Page {currentPage + 1} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
