export interface Subscription {
  id: number;
  organizationId: number;
  organizationName: string;
  bundleId: number;
  bundleName: string;
  status: string;
  remainingConsultations: number;
  totalConsultations: number;
  price: number;
  nextBillingDate: string;
  createdAt: string;
}

export interface CreateSubscriptionPayload {
  organizationId: number;
  bundleId: number;
}

export interface UpdateSubscriptionPayload {
  remainingConsultations?: number;
  totalConsultations?: number;
  price?: number;
  status?: string;
  nextBillingDate?: string;
}
