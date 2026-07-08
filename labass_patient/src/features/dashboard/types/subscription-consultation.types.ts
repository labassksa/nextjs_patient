/**
 * Admin "subscription consultations" — consultations that originated from a
 * subscription bundle. Two views share this shape:
 *   - organizations: a marketer created it from an org's bundle
 *     (includes `subscription.organization` and `marketer`)
 *   - individuals:   a patient booked it from their own bundle
 *     (no `subscription.organization`, no `marketer`)
 *
 * Don't rely on the org-only fields being present in the individuals view, nor
 * on them being absent in the org view beyond display logic.
 */
export type SubscriptionConsultationsVariant = "organizations" | "individuals";

export interface AdminSubscriptionConsultation {
  id: number;
  createdAt: string;
  status: string; // ConsultationStatus enum
  type: string; // ConsultationType enum (Quick, Specialized, Vitamins, ...)
  labConsultationType: string | null; // only for laboratory orgs, else null
  closedAt: string | null;
  subscription: {
    id: number;
    bundle: { type: string } | null;
    // organizations view only:
    organization?: { id: number; name: string; type: string } | null;
  } | null;
  patient: { user: { firstName?: string; lastName?: string; gender?: string } } | null;
  doctor: { user: { firstName?: string; lastName?: string } } | null;
  // organizations view only (who created it):
  marketer?: { id: number; user: { firstName?: string; lastName?: string } } | null;
}

export interface AdminSubscriptionConsultationsResponse {
  consultations: AdminSubscriptionConsultation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SubscriptionConsultationsParams {
  bundleType?: string;
  subscriptionId?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}
