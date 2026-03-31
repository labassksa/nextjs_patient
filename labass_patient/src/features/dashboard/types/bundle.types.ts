export interface Bundle {
  id: number;
  name: string;
  type: string;
  price: number;
  consultationCount: number;
  currency: string;
  recurringType: string;
  isActive: boolean;
  description: string;
  createdAt: string;
}

export interface CreateBundlePayload {
  name: string;
  type: string;
  price: number;
  consultationCount: number;
  currency: string;
  recurringType: string;
  description: string;
}

export interface UpdateBundlePayload {
  price?: number;
  consultationCount?: number;
  description?: string;
  name?: string;
  type?: string;
  recurringType?: string;
}
