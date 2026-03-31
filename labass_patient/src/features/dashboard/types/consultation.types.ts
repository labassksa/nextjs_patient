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
