export interface MarketerUser {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface MarketerOrganization {
  id: number;
  name: string;
  city?: string;
  type?: string;
  dealType?: string;
}

export interface Marketer {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  nationalId: string;
  iban: string;
  nationality: string;
  organizationId: number;
  user?: MarketerUser;
  organization?: MarketerOrganization;
  promoCodes: PromoCode[];
  createdAt: string;
}

export interface PromoCode {
  id: number;
  code: string;
  marketerId: number;
  discountPercentage: number;
  marketerPercentage: number;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface CreateMarketerPayload {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  nationalId: string;
  role: string[];
  iban: string;
  nationality: string;
  organizationId: number;
}

export interface UpdateMarketerPayload {
  marketerId: number;
  marketerData: {
    iban?: string;
    nationality?: string;
  };
  userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    gender?: string;
    nationalId?: string;
    dateOfBirth?: string;
  };
}

export interface GeneratePromoCodePayload {
  marketerId: number;
  discountPercentage: number;
  marketerPercentage: number;
  numberOfCodes: number;
}

export interface UpdatePromoCodePayload {
  codeId: number;
  isActive?: string;
}

export interface MarketerConsultation {
  id: number;
  status: string;
  createdAt: string;
  doctorJoinedAT: string | null;
  patientJoinedAT: string | null;
  paidAT: string | null;
  closedAt: string | null;
  prescriptionPDFUrl?: string;
  marketer: { phoneNumber?: string; firstName: string | null; lastName: string | null };
  patient: { id?: number; phoneNumber?: string; firstName?: string; lastName?: string };
  doctor: { phoneNumber?: string; firstName?: string; lastName?: string };
}

export interface MarketerConsultationsResponse {
  consultations: MarketerConsultation[];
  total: number;
}
