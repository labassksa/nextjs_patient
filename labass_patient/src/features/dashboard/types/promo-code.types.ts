export interface PromoCode {
  id: number;
  code: string;
  marketerId: number;
  marketerName: string;
  discountPercentage: number;
  marketerPercentage: number;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface GeneratePromoCodePayload {
  marketerId: number;
  discountPercentage: number;
  marketerPercentage: number;
  numberOfCodes: number;
}

export interface TogglePromoCodePayload {
  codeId: number;
}

export interface UpdatePromoCodePayload {
  codeId: number;
  isActive?: string;
}

export interface ResetPromoUsagePayload {
  codeId: number;
}

export interface ResetMarketerPromoUsagePayload {
  marketerId: number;
}

export interface ResetOrgPromoUsagePayload {
  organizationId: number;
}
