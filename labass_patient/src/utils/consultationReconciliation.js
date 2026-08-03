const AMBIGUOUS_STATUSES = new Set([499, 502, 503, 504]);
const FIVE_MINUTES_MS = 5 * 60 * 1000;

export function isAmbiguousConsultationError(error) {
  const status = Number(error?.response?.status);
  if (AMBIGUOUS_STATUSES.has(status)) return true;
  return Boolean(error?.request && !error?.response);
}

export function extractConsultations(response) {
  const value =
    response?.data?.consultations ??
    response?.data?.data?.consultations ??
    response?.data?.data ??
    response?.data ??
    response;
  return Array.isArray(value) ? value : [];
}

export function sortConsultationsNewestFirst(consultations) {
  return [...consultations].sort((left, right) => {
    const leftTime = Date.parse(left?.createdAt ?? "");
    const rightTime = Date.parse(right?.createdAt ?? "");
    if (!Number.isFinite(leftTime)) return 1;
    if (!Number.isFinite(rightTime)) return -1;
    return rightTime - leftTime;
  });
}

export function getRecentConsultationDateRange(startedAt, now = Date.now()) {
  return {
    fromDate: new Date(startedAt - FIVE_MINUTES_MS),
    toDate: new Date(now),
  };
}

function normalized(value) {
  if (value === undefined || value === null) return "";
  const text = String(value).trim().toLowerCase();
  return text === "general" ? "quick" : text;
}

function digits(value) {
  return String(value ?? "").replace(/\D/g, "").slice(-9);
}

function patientMatches(consultation, criteria) {
  if (criteria.patientScopedList) return true;
  const patient = consultation?.patient ?? consultation?.patientProfile ?? {};

  if (criteria.patientId && patient.id) {
    return String(criteria.patientId) === String(patient.id);
  }
  if (criteria.nationalId && patient.nationalId) {
    return normalized(criteria.nationalId) === normalized(patient.nationalId);
  }
  if (criteria.phoneNumber && patient.phoneNumber) {
    return digits(criteria.phoneNumber) === digits(patient.phoneNumber);
  }

  const expectedName = normalized(`${criteria.firstName ?? ""} ${criteria.lastName ?? ""}`);
  const actualName = normalized(`${patient.firstName ?? ""} ${patient.lastName ?? ""}`);
  return Boolean(expectedName && actualName && expectedName === actualName);
}

function optionalScopeMatches(expected, actual) {
  if (expected === undefined || expected === null || expected === "") return true;
  if (actual === undefined || actual === null || actual === "") return false;
  return normalized(expected) === normalized(actual);
}

export function findMatchingRecentConsultation(
  consultations,
  criteria,
  now = Date.now()
) {
  const earliest = Math.max(now - FIVE_MINUTES_MS, (criteria.startedAt ?? now) - 5_000);

  return sortConsultationsNewestFirst(consultations).find((consultation) => {
    const createdAt = Date.parse(consultation?.createdAt ?? "");
    if (!Number.isFinite(createdAt) || createdAt < earliest || createdAt > now + 30_000) {
      return false;
    }
    if (!patientMatches(consultation, criteria)) return false;

    const type = consultation?.consultationType ?? consultation?.type;
    if (normalized(type) !== normalized(criteria.consultationType)) return false;

    const labType = consultation?.labConsultationType ?? consultation?.testType;
    if (criteria.labConsultationType && normalized(labType) !== normalized(criteria.labConsultationType)) {
      return false;
    }

    const subscriptionId = consultation?.subscriptionId ?? consultation?.subscription?.id;
    const organizationId =
      consultation?.organizationId ??
      consultation?.organization?.id ??
      consultation?.marketer?.organizationId;
    const organizationName =
      consultation?.organization?.name ?? consultation?.marketer?.orgName;
    const bundleType =
      consultation?.bundleType ??
      consultation?.subscription?.bundleType ??
      consultation?.subscription?.bundle?.type;

    return (
      optionalScopeMatches(criteria.subscriptionId, subscriptionId) &&
      optionalScopeMatches(criteria.organizationId, organizationId) &&
      optionalScopeMatches(criteria.organizationName, organizationName) &&
      optionalScopeMatches(criteria.bundleType, bundleType)
    );
  });
}
