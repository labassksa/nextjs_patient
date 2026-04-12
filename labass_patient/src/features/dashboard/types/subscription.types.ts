export interface Subscription {
  id: number;
  organization: { id: number; name: string; type?: string; city?: string };
  bundle: { id: number; name: string; type?: string; consultationCount?: number };
  status: string;
  remainingConsultations: number;
  totalConsultations: number;
  price: number;
  currency?: string;
  nextBillingDate: string | null;
  recurringType?: string;
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
