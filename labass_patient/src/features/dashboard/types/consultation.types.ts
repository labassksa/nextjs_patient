import type { PaymentMethodEnum } from "@/types/paymentMethods";

export interface Consultation {
  id: number;
  patientId: number;
  doctorId: number;
  patientName: string;
  doctorName: string;
  status: string;
  type: string;
  createdAt: string;
  closedAt: string | null;
  paymentMethod: string;
  organizationId: number | null;
  organizationName: string | null;
}

export interface SendFollowUpPayload {
  consultationId: string;
  paymentMethod: string;
}

export interface ConsultationReportParams {
  fromDate?: string;
  toDate?: string;
  orgId?: number;
  marketerId?: number;
  page?: number;
  limit?: number;
}

export interface ConsultationReportRow {
  createdAt?: string;
  status?: string;
  id?: number;
  doctorJoinedAT?: string;
  patientJoinedAT?: string;
  paidAT?: string;
  closedAt?: string;
  prescriptionPDFUrl?: string;
  price?: number;
  paymentMethod?: PaymentMethodEnum | string;
  marketer?: {
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    orgName?: string;
  };
  patient?: {
    id?: number;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
  };
  doctor?: {
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
  };
  subscription?: {
    id?: number;
    bundleType?: string;
    remainingConsultations?: number;
  };
}

export interface ConsultationReportResponse {
  consultations: ConsultationReportRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
