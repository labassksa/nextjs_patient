export interface Doctor {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  nationalId: string;
  specialty: string;
  medicalLicenseNumber: string;
  iban: string;
  isActive: boolean;
  nationality: string;
  createdAt: string;
}

export interface CreateDoctorPayload {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  nationalId: string;
  role: string;
  iban: string;
  specialty: string;
  medicalLicenseNumber: string;
}

export interface UpdateDoctorPayload {
  doctorId: number;
  doctor: {
    specialty?: string;
    iban?: string;
    medicalLicenseNumber?: string;
    isActive?: boolean;
  };
  user: {
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    nationality?: string;
  };
}
