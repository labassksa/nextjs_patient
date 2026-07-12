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

export interface SearchConsultationsByDrugParams {
  search: string;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
}

export interface DrugSearchDrug {
  id: number;
  drugName: string;
  activeIngredient?: string;
  strength: string;
  pharmaceuticalForm: string;
  dose: string;
  doseUnit?: string;
  registrationNo: string;
  route: string;
  frequency: string;
  indications?: string;
  duration: string;
  durationUnit: string;
  prn: boolean;
}

export interface DrugSearchConsultation {
  id: number;
  createdAt: string;
  status: string;
  doctorJoinedAT?: string | null;
  patientJoinedAT?: string | null;
  paidAT?: string | null;
  closedAt?: string | null;
  patient?: {
    id: number;
    user?: {
      phoneNumber?: string;
      firstName?: string;
      lastName?: string;
    };
  };
  doctor?: {
    id: number;
    user?: {
      phoneNumber?: string;
      firstName?: string;
      lastName?: string;
    };
  };
  prescription?: {
    id: number;
    pdfURL?: string;
    diagnoses?: string[];
    allergies?: string[];
    drugs?: DrugSearchDrug[];
  };
  payment?: {
    invoiceValue?: number | string;
    paymentMethod?: string | null;
    promotionalCode?: {
      marketerProfile?: {
        user?: {
          phoneNumber?: string;
          firstName?: string;
          lastName?: string;
        };
        organization?: {
          name?: string;
        };
      };
    };
  };
  subscription?: {
    id: number;
    bundle?: {
      type?: string;
      name?: string;
    };
  };
}

export interface SearchConsultationsByDrugResponse {
  consultations: DrugSearchConsultation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
