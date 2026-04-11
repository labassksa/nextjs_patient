import type { Marketer } from "./marketer.types";

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

export interface OrgReportConsultation {
  id: number;
  status: string;
  createdAt: string;
  doctorJoinedAT: string | null;
  patientJoinedAT: string | null;
  paidAT: string | null;
  closedAt: string | null;
  prescriptionPDFUrl?: string;
  marketer: { phoneNumber?: string; firstName: string | null; lastName: string | null; orgName?: string };
  patient: { id?: number; phoneNumber?: string; firstName?: string; lastName?: string };
  doctor: { phoneNumber?: string; firstName?: string; lastName?: string };
}

export interface OrgReportResponse {
  consultations: OrgReportConsultation[];
  total: number;
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
