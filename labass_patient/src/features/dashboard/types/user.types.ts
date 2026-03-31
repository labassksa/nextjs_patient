export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string | null;
  role: string | string[];
  gender: string;
  nationalId: string;
  dateOfBirth: string;
  nationality: string;
  createdAt: string;
}

export interface CreateAdminPayload {
  phoneNumber: string;
  role: string;
}
