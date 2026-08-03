import i18n from "./i18n";

/**
 * Single source of truth for bundle "type" values.
 *
 * The backend uses a stable machine key for a bundle's `type` (e.g. "gpConsultations").
 * The backend never sends a display label — producing the human-readable label is
 * entirely the frontend's responsibility and lives here.
 *
 * - Compare/branch against the machine keys below, never against labels.
 * - Send the machine key to the backend, never the label.
 * - Display via labelForBundleType(type).
 */

export const BUNDLE_TYPE_KEYS = [
  "gpConsultations",
  "specialistConsultations",
  "vitamins",
  "obesityProgram",
  "sexualHealth",
] as const;

export type BundleTypeKey = (typeof BUNDLE_TYPE_KEYS)[number];

const BUNDLE_TYPE_LABELS: Record<BundleTypeKey, { en: string; ar: string }> = {
  gpConsultations:         { en: "GP Consultations",         ar: "استشارات طبيب عام" },
  specialistConsultations: { en: "Specialist Consultations", ar: "استشارات أخصائي" },
  vitamins:                { en: "Vitamins",                 ar: "الفيتامينات" },
  obesityProgram:          { en: "Obesity Program",          ar: "برنامج السمنة" },
  sexualHealth:            { en: "Sexual Health",            ar: "الصحة الجنسية" },
};

/**
 * Map a bundle-type machine key to its display label.
 *
 * @param type The machine key coming from the API (directly or via an embedded bundle).
 * @param lang Force a language. Defaults to the current i18n language, falling back to Arabic.
 * @returns The localized label, or the raw key for unknown/unlisted values (never crashes).
 */
export function labelForBundleType(
  type: string | null | undefined,
  lang?: "en" | "ar"
): string {
  if (!type) return "";
  const entry = BUNDLE_TYPE_LABELS[type as BundleTypeKey];
  if (!entry) return type; // unknown key: show the raw key rather than crashing
  const resolved = lang ?? (i18n.language?.startsWith("en") ? "en" : "ar");
  return entry[resolved];
}

/**
 * Options for dropdowns/pickers: the machine key is the option `value`, the mapped
 * label is the visible text. Pass `lang` to control the label language ("en" for the
 * English admin dashboard).
 */
export function bundleTypeOptions(lang?: "en" | "ar"): { value: BundleTypeKey; label: string }[] {
  return BUNDLE_TYPE_KEYS.map((value) => ({ value, label: labelForBundleType(value, lang) }));
}
