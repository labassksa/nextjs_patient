"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { useDrugConsultationSearch } from "@/features/dashboard/hooks/use-consultations";
import type { DrugSearchConsultation, DrugSearchDrug } from "@/features/dashboard/types/consultation.types";
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
import { CalendarClock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ExternalLink, FileText, Pill, Search, Stethoscope, User } from "lucide-react";

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
  if (!values?.length) return <span className="text-sm">{EMPTY_REPORT_VALUE}</span>;

  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((value, index) => (
        <Badge key={`${value}-${index}`} variant="secondary" className="max-w-[320px] truncate">
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

function DetailItem({ label, value, dir }: { label: string; value: ReactNode; dir?: "ltr" | "rtl" }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 truncate text-sm font-medium" dir={dir}>{value}</div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof Pill; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
  );
}

function DrugPanel({ drug, search }: { drug: DrugSearchDrug; search: string }) {
  return (
    <div className="rounded-md border bg-background">
      <div className="flex flex-col gap-2 border-b bg-muted/30 p-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{highlightMatch(drug.drugName, search)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Active ingredient: {highlightMatch(drug.activeIngredient, search)}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1">
          <Badge variant="outline" className="font-mono">{highlightMatch(drug.registrationNo, search)}</Badge>
          <Badge variant={drug.prn ? "default" : "outline"}>{drug.prn ? "PRN" : "Not PRN"}</Badge>
        </div>
      </div>
      <div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-4">
        <DetailItem label="Strength" value={formatReportValue(drug.strength)} />
        <DetailItem label="Pharmaceutical form" value={formatReportValue(drug.pharmaceuticalForm)} />
        <DetailItem label="Dose" value={formatDrugDose(drug)} />
        <DetailItem label="Frequency" value={formatReportValue(drug.frequency)} />
        <DetailItem label="Duration" value={formatDrugDuration(drug)} />
        <DetailItem label="Route" value={formatReportValue(drug.route)} />
        <div className="sm:col-span-2">
          <DetailItem label="Indications" value={formatReportValue(drug.indications)} />
        </div>
      </div>
    </div>
  );
}

function ConsultationResultCard({ consultation, search }: { consultation: DrugSearchConsultation; search: string }) {
  const drugs = consultation.prescription?.drugs ?? [];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base">Consultation #{consultation.id}</CardTitle>
            <StatusBadge status={consultation.status} />
            <Badge variant="outline" className="font-mono">{drugs.length} drugs</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Created {formatReportDateTime(consultation.createdAt)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-4">
        <section>
          <SectionTitle icon={CalendarClock} title="Timeline" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem label="Created at" value={formatReportDateTime(consultation.createdAt)} />
            <DetailItem label="Paid at" value={formatReportDateTime(consultation.paidAT)} />
            <DetailItem label="Closed at" value={formatReportDateTime(consultation.closedAt)} />
            <DetailItem label="Patient joined" value={formatReportDateTime(consultation.patientJoinedAT)} />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div>
            <SectionTitle icon={User} title="Patient" />
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Name" value={formatReportName(consultation.patient?.user)} />
              <DetailItem label="Phone" value={formatReportValue(consultation.patient?.user?.phoneNumber)} dir="ltr" />
            </div>
          </div>
          <div>
            <SectionTitle icon={Stethoscope} title="Doctor" />
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Name" value={formatReportName(consultation.doctor?.user)} />
              <DetailItem label="Phone" value={formatReportValue(consultation.doctor?.user?.phoneNumber)} dir="ltr" />
            </div>
          </div>
        </section>

        <section>
          <SectionTitle icon={FileText} title="Prescription" />
          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">PDF</p>
              {consultation.prescription?.pdfURL ? (
                <a
                  href={consultation.prescription.pdfURL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-custom-green hover:underline"
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
        </section>

        <section>
          <SectionTitle icon={Pill} title="Prescribed drugs" />
          {drugs.length === 0 ? (
            <p className="rounded-md border border-dashed py-6 text-center text-sm text-muted-foreground">
              No prescribed drugs returned for this consultation.
            </p>
          ) : (
            <div className="grid gap-3">
              {drugs.map((drug) => (
                <DrugPanel key={drug.id} drug={drug} search={search} />
              ))}
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
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
    <div className="space-y-4">
      <PageHeader
        title="Drug Search"
        description="Find admin consultations by drug name, active ingredient, or registration number"
      />

      <Card>
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

      {!queryEnabled ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Pill}
              title="Search consultations by drug"
              description="Enter at least 2 characters to search by drug name, active ingredient, or registration number."
            />
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent>
            <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-10">Searching consultations...</p>
          </CardContent>
        </Card>
      ) : consultations.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Pill}
              title="No consultations found"
              description="No matching consultation prescriptions were found for this search."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
                  {total} consultations found
                </p>
                <p className="text-xs text-muted-foreground">
                  Showing {firstVisible} to {lastVisible} of {total} results for &quot;{submittedSearch}&quot;
                </p>
              </div>
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
            </CardContent>
          </Card>

          {consultations.map((consultation) => (
            <ConsultationResultCard
              key={consultation.id}
              consultation={consultation}
              search={submittedSearch}
            />
          ))}

          <Card>
            <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
