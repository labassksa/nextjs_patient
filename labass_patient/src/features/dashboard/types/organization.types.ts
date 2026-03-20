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
}

export interface CreateOrganizationPayload {
  name: string;
  iban: string;
  city: string;
  numberOfBranches: number;
  type: string;
  dealType: string;
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
