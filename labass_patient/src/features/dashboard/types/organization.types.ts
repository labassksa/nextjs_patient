import type { Marketer } from "./marketer.types";
import type { ConsultationReportResponse, ConsultationReportRow } from "./consultation.types";

export interface Organization {
  id: number;
  name: string;
  iban: string;
  city: string;
  numberOfBranches: number;
  type: string;
  dealType: string;
  phoneNumber?: string;
  organizationManagerName?: string;
  marketers: Marketer[];
  createdAt: string;
  consultationCountLast30Days?: number;
}

export interface CreateOrganizationPayload {
  name: string;
  iban: string;
  city: string;
  numberOfBranches: number;
  type: string;
  dealType: string;
}

export type OrgReportConsultation = ConsultationReportRow;
export type OrgReportResponse = ConsultationReportResponse;

export interface SubscriptionConsultation {
  id: number;
  type: string;
  status: string;
  createdAt: string;
  subscription: {
    id: number;
    remainingConsultations: number;
    totalConsultations: number;
    bundle: { type: string };
  };
  patient: { user: { firstName: string; phoneNumber: string } };
  doctor: { user: { firstName: string; lastName: string } };
}

export interface SubscriptionConsultationsResponse {
  consultations: SubscriptionConsultation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UpdateOrganizationPayload {
  organizationId: number;
  name?: string;
  type?: string;
  dealType?: string;
  city?: string;
  numberOfBranches?: number;
  iban?: string;
  phoneNumber?: string;
  organizationManagerName?: string;
}
