// models/Consultation.ts
import { DoctorProfile } from "./doctorProfile";
import { PatientProfile } from "./patientProfile";
import { Prescription } from "./prescription"; // Import Prescription class

export enum ConsultationType {
  Quick = "Quick",
  Detailed = "Detailed",
}

export enum ConsultationStatus {
  Paid = "Paid",
  Open = "Open",
  Closed = "Closed",
  PendingPayment = "PendingPayment",
  Failed = "Failed",
}

export class Consultation {
  constructor(
    public id: number,
    public createdAt: Date,
    public patientJoinedAT: Date,
    public doctorJoinedAT: Date,
    public paidAT: Date,
    public closedAt: Date,
    public status: ConsultationStatus,
    public type: ConsultationType,
    public patient: PatientProfile,
    public doctor?: DoctorProfile | null, // Allowing null here
    public prescription?: Prescription // Added Prescription object
  ) {}
}
