export interface BundlesResponse {
  active: Bundle[];
  inactive: Bundle[];
}

export interface Bundle {
  id: number;
  name: string;
  type: string;
  price: number;
  originalPrice?: number;
  consultationCount: number;
  currency: string;
  recurringType: string;
  isActive: boolean;
  description: string;
  createdAt: string;
  whoSubscribes?: "individual" | "organization";
  isUnlimited?: boolean;
}

export interface CreateBundlePayload {
  name: string;
  type: string;
  price: number;
  originalPrice?: number;
  consultationCount: number;
  currency: string;
  recurringType: string;
  intervalDays?: number;
  description: string;
  whoSubscribes?: "individual" | "organization";
  isUnlimited?: boolean;
}

export interface UpdateBundlePayload {
  price?: number;
  originalPrice?: number;
  consultationCount?: number;
  description?: string;
  name?: string;
  type?: string;
  recurringType?: string;
  intervalDays?: number;
  whoSubscribes?: "individual" | "organization";
  isUnlimited?: boolean;
}
