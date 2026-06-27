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

export interface ReferralSubscription {
  id: number;
  status: string;
  createdAt: string;
  price: number;
  currency?: string;
  bundle?: { id: number; name: string; type?: string };
  patient?: { id: number; user?: { firstName?: string; lastName?: string; phoneNumber?: string } };
  referralCode?: {
    id: number;
    code: string;
    marketer?: { id: number; user?: { firstName?: string; lastName?: string } };
  };
  organization?: { id: number; name: string };
}

export interface ReferralReportResponse {
  data: ReferralSubscription[];
  total: number;
  page: number;
  limit: number;
  summary?: {
    byOrganization: { organizationId: number; organizationName: string; totalSubscriptions: number; totalRevenue?: number }[];
    byMarketer: { marketerId: number; marketerName: string; organizationName?: string; totalSubscriptions: number }[];
  };
}

export interface ReferralReportParams {
  fromDate?: string;
  toDate?: string;
  organizationId?: number;
  marketerId?: number;
  status?: string;
  page?: number;
  limit?: number;
}
