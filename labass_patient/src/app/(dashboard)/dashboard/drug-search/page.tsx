"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { useDrugConsultationSearch } from "@/features/dashboard/hooks/use-consultations";
import type { DrugSearchDrug } from "@/features/dashboard/types/consultation.types";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { StatusBadge } from "@/features/dashboard/components/shared/status-badge";
import { EmptyState } from "@/features/dashboard/components/shared/empty-state";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { EMPTY_REPORT_VALUE, formatReportDateTime, formatReportName, formatReportValue } from "@/features/dashboard/utils/consultation-report";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ExternalLink, Pill, Search } from "lucide-react";

function highlightMatch(value: string | undefined, search: string): ReactNode {
  if (!value) return EMPTY_REPORT_VALUE;
  const term = search.trim();
  if (term.length < 2) return value;

  const index = value.toLowerCase().indexOf(term.toLowerCase());
  if (index === -1) return value;

  return (
    <>
      {value.slice(0, index)}
      <mark className="rounded bg-yellow-100 px-0.5 text-inherit">{value.slice(index, index + term.length)}</mark>
      {value.slice(index + term.length)}
    </>
  );
}

function renderList(values?: string[]) {
  if (!values?.length) return EMPTY_REPORT_VALUE;

  return (
    <div className="flex flex-wrap gap-1">
      {values.map((value, index) => (
        <Badge key={`${value}-${index}`} variant="secondary" className="max-w-[260px] truncate">
          {value}
        </Badge>
      ))}
    </div>
  );
}

function formatDrugDose(drug: DrugSearchDrug) {
  return [drug.dose, drug.doseUnit].filter(Boolean).join(" ") || EMPTY_REPORT_VALUE;
}

function formatDrugDuration(drug: DrugSearchDrug) {
  return [drug.duration, drug.durationUnit].filter(Boolean).join(" ") || EMPTY_REPORT_VALUE;
}

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;

    if (error.response?.status === 400) return "Enter at least 2 characters and provide either both dates or no date range.";
    if (error.response?.status === 401) return "You are not authorized to use drug search.";
    if (error.response?.status === 500) return "The backend could not complete the drug search.";
  }

  return "An error occurred while searching consultations.";
}

export default function DrugSearchPage() {
  const today = new Date().toISOString().split("T")[0];
  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [submittedFromDate, setSubmittedFromDate] = useState("");
  const [submittedToDate, setSubmittedToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const searchIsValid = searchInput.trim().length >= 2;
  const dateRangeIsValid = (!fromDate && !toDate) || (!!fromDate && !!toDate);
  const canSearch = searchIsValid && dateRangeIsValid;
  const queryEnabled = submittedSearch.trim().length >= 2 && ((!submittedFromDate && !submittedToDate) || (!!submittedFromDate && !!submittedToDate));

  const queryParams = useMemo(() => ({
    search: submittedSearch,
    page,
    limit,
    fromDate: submittedFromDate || undefined,
    toDate: submittedToDate || undefined,
  }), [limit, page, submittedFromDate, submittedSearch, submittedToDate]);

  const { data, isLoading, error, refetch } = useDrugConsultationSearch(queryParams, queryEnabled);
  const consultations = data?.consultations ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const responsePage = data?.page ?? page;
  const responseLimit = data?.limit ?? limit;
  const firstVisible = total > 0 ? (responsePage - 1) * responseLimit + 1 : 0;
  const lastVisible = Math.min(responsePage * responseLimit, total);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSearch) return;

    setSubmittedSearch(searchInput.trim());
    setSubmittedFromDate(fromDate);
    setSubmittedToDate(toDate);
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        title="Drug Search"
        description="Find admin consultations by drug name, active ingredient, or registration number"
      />

      <Card className="mb-4">
        <CardContent className="pt-4">
          <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
            <div className="space-y-1 min-w-[260px] flex-1">
              <Label className="text-xs text-muted-foreground">Drug search</Label>
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Drug name, active ingredient, or registration number"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">From</Label>
              <Input
                type="date"
                lang="en"
                dir="ltr"
                value={fromDate}
                max={toDate || today}
                onChange={(event) => setFromDate(event.target.value)}
                className="w-auto"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">To</Label>
              <Input
                type="date"
                lang="en"
                dir="ltr"
                value={toDate}
                min={fromDate || undefined}
                max={today}
                onChange={(event) => setToDate(event.target.value)}
                className="w-auto"
              />
            </div>
            <Button type="submit" disabled={!canSearch || isLoading}>
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? "Searching..." : "Search"}
            </Button>
            {(fromDate || toDate) && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
              >
                Clear dates
              </Button>
            )}
          </form>
          {!searchIsValid && searchInput.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">Enter at least 2 characters.</p>
          )}
          {!dateRangeIsValid && (
            <p className="mt-2 text-sm text-destructive">Select both From and To dates, or clear both.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base">
            Search results{" "}
            {queryEnabled && <Badge variant="secondary" className="ml-2 font-mono">{total}</Badge>}
          </CardTitle>
          {queryEnabled && consultations.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select value={String(limit)} onValueChange={(value) => { setLimit(Number(value)); setPage(1); }}>
                <SelectTrigger className="h-8 w-[76px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 100].map((size) => (
                    <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!queryEnabled ? (
            <EmptyState
              icon={Pill}
              title="Search consultations by drug"
              description="Enter at least 2 characters to search by drug name, active ingredient, or registration number."
            />
          ) : error ? (
            <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
          ) : isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-10">Searching consultations...</p>
          ) : consultations.length === 0 ? (
            <EmptyState
              icon={Pill}
              title="No consultations found"
              description="No matching consultation prescriptions were found for this search."
            />
          ) : (
            <div className="space-y-4">
              {consultations.map((consultation) => {
                const drugs = consultation.prescription?.drugs ?? [];

                return (
                  <div key={consultation.id} className="rounded-md border">
                    <div className="grid gap-4 p-4 md:grid-cols-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Consultation</p>
                        <p className="font-mono text-sm">#{consultation.id}</p>
                        <div className="mt-2">
                          <StatusBadge status={consultation.status} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Timeline</p>
                        <p className="text-sm">Created: {formatReportDateTime(consultation.createdAt)}</p>
                        <p className="text-sm">Paid: {formatReportDateTime(consultation.paidAT)}</p>
                        <p className="text-sm">Closed: {formatReportDateTime(consultation.closedAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Patient</p>
                        <p className="text-sm font-medium">{formatReportName(consultation.patient?.user)}</p>
                        <p className="text-xs text-muted-foreground font-mono" dir="ltr">
                          {formatReportValue(consultation.patient?.user?.phoneNumber)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Doctor</p>
                        <p className="text-sm font-medium">{formatReportName(consultation.doctor?.user)}</p>
                        <p className="text-xs text-muted-foreground font-mono" dir="ltr">
                          {formatReportValue(consultation.doctor?.user?.phoneNumber)}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 border-t p-4 md:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Prescription PDF</p>
                        {consultation.prescription?.pdfURL ? (
                          <a
                            href={consultation.prescription.pdfURL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-custom-green hover:underline"
                          >
                            Open PDF <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-sm">{EMPTY_REPORT_VALUE}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Diagnoses</p>
                        {renderList(consultation.prescription?.diagnoses)}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Allergies</p>
                        {renderList(consultation.prescription?.allergies)}
                      </div>
                    </div>

                    <div className="border-t p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">Prescribed drugs</p>
                        <Badge variant="outline" className="font-mono">{drugs.length}</Badge>
                      </div>
                      {drugs.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No prescribed drugs returned for this consultation.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table className="min-w-[1500px]">
                            <TableHeader>
                              <TableRow>
                                <TableHead>Drug name</TableHead>
                                <TableHead>Active ingredient</TableHead>
                                <TableHead>Strength</TableHead>
                                <TableHead>Pharmaceutical form</TableHead>
                                <TableHead>Dose</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Registration number</TableHead>
                                <TableHead>PRN</TableHead>
                                <TableHead>Indications</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {drugs.map((drug) => (
                                <TableRow key={drug.id}>
                                  <TableCell className="font-medium">{highlightMatch(drug.drugName, submittedSearch)}</TableCell>
                                  <TableCell>{highlightMatch(drug.activeIngredient, submittedSearch)}</TableCell>
                                  <TableCell>{formatReportValue(drug.strength)}</TableCell>
                                  <TableCell>{formatReportValue(drug.pharmaceuticalForm)}</TableCell>
                                  <TableCell>{formatDrugDose(drug)}</TableCell>
                                  <TableCell>{formatReportValue(drug.frequency)}</TableCell>
                                  <TableCell>{formatDrugDuration(drug)}</TableCell>
                                  <TableCell>{formatReportValue(drug.route)}</TableCell>
                                  <TableCell className="font-mono text-xs">{highlightMatch(drug.registrationNo, submittedSearch)}</TableCell>
                                  <TableCell>
                                    <Badge variant={drug.prn ? "default" : "outline"}>{drug.prn ? "Yes" : "No"}</Badge>
                                  </TableCell>
                                  <TableCell className="max-w-[300px] whitespace-normal">{formatReportValue(drug.indications)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 py-4">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{firstVisible}</span> to{" "}
                  <span className="font-medium text-foreground">{lastVisible}</span> of{" "}
                  <span className="font-medium text-foreground">{total}</span> results
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground mr-2">
                    Page {responsePage} of {totalPages}
                  </span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(1)} disabled={!data?.hasPreviousPage}>
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(Math.max(1, page - 1))} disabled={!data?.hasPreviousPage}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(page + 1)} disabled={!data?.hasNextPage}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(totalPages)} disabled={!data?.hasNextPage}>
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
