import type { ConsultationReportRow } from "../types/consultation.types";
import { labelForBundleType } from "@/utils/bundleType";

export const EMPTY_REPORT_VALUE = "—";

export const CONSULTATION_REPORT_EXPORT_HEADERS = [
  "Consultation ID",
  "Created date/time",
  "Status",
  "Paid at",
  "Closed at",
  "Doctor joined at",
  "Patient joined at",
  "Price",
  "Payment method",
  "Prescription PDF link",
  "Marketer name",
  "Marketer phone",
  "Marketer organization",
  "Patient ID",
  "Patient name",
  "Patient phone",
  "Doctor name",
  "Doctor phone",
  "Subscription ID",
  "Bundle type",
  "Remaining consultations",
] as const;

export function formatReportValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return EMPTY_REPORT_VALUE;
  return String(value);
}

export function formatReportDateTime(value?: string | null): string {
  if (!value) return EMPTY_REPORT_VALUE;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatReportAmount(value?: number | null): string {
  if (typeof value !== "number") return EMPTY_REPORT_VALUE;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "SAR",
  }).format(value);
}

export function formatReportName(person?: { firstName?: string | null; lastName?: string | null }): string {
  const name = [person?.firstName, person?.lastName].filter(Boolean).join(" ").trim();
  return name || EMPTY_REPORT_VALUE;
}

export function formatBundleType(bundleType?: string | null): string {
  return bundleType ? labelForBundleType(bundleType, "en") : EMPTY_REPORT_VALUE;
}

export function getCurrentPageSubtotal(rows: ConsultationReportRow[]): number {
  return rows.reduce((total, row) => total + (row.price || 0), 0);
}

export function getConsultationReportExportRow(row: ConsultationReportRow): string[] {
  return [
    formatReportValue(row.id),
    formatReportDateTime(row.createdAt),
    formatReportValue(row.status),
    formatReportDateTime(row.paidAT),
    formatReportDateTime(row.closedAt),
    formatReportDateTime(row.doctorJoinedAT),
    formatReportDateTime(row.patientJoinedAT),
    formatReportAmount(row.price),
    formatReportValue(row.paymentMethod),
    formatReportValue(row.prescriptionPDFUrl),
    formatReportName(row.marketer),
    formatReportValue(row.marketer?.phoneNumber),
    formatReportValue(row.marketer?.orgName),
    formatReportValue(row.patient?.id),
    formatReportName(row.patient),
    formatReportValue(row.patient?.phoneNumber),
    formatReportName(row.doctor),
    formatReportValue(row.doctor?.phoneNumber),
    formatReportValue(row.subscription?.id),
    formatBundleType(row.subscription?.bundleType),
    formatReportValue(row.subscription?.remainingConsultations),
  ];
}

export async function exportConsultationReportToExcel(options: {
  filename: string;
  titleText: string;
  rows: ConsultationReportRow[];
}) {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Consultations");

  worksheet.mergeCells(1, 1, 1, CONSULTATION_REPORT_EXPORT_HEADERS.length);
  const titleCell = worksheet.getCell("A1");
  titleCell.value = options.titleText;
  titleCell.font = { bold: true, size: 14 };
  titleCell.alignment = { horizontal: "center", vertical: "middle", readingOrder: "rtl" };
  worksheet.getRow(1).height = 28;

  worksheet.addRow([]);

  const headerRow = worksheet.addRow([...CONSULTATION_REPORT_EXPORT_HEADERS]);
  headerRow.font = { bold: true };
  headerRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0E0E0" } };
  });

  for (const row of options.rows) {
    worksheet.addRow(getConsultationReportExportRow(row));
  }

  CONSULTATION_REPORT_EXPORT_HEADERS.forEach((_, index) => {
    worksheet.getColumn(index + 1).width = 24;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${options.filename}.xlsx`;
  anchor.click();
  URL.revokeObjectURL(url);
}
