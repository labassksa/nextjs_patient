"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getBundles, Bundle } from "../_controllers/getBundles";
import { useRouter } from "next/navigation";

interface AvailableBundlesSectionProps {
  onSubscribe?: (bundleId: number) => void;
}

const AvailableBundlesSection: React.FC<AvailableBundlesSectionProps> = ({
  onSubscribe,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const router = useRouter();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const fetchBundles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getBundles();
        if (response.success && response.data) {
          const activeBundles = response.data.filter(
            (bundle) =>
              bundle.isActive &&
              bundle.type !== "Vitamins" &&
              bundle.whoSubscribes === "organization"
          );
          setBundles(activeBundles);
        } else {
          setError(response.message || t('subscription.errorLoadingBundles'));
        }
      } catch (err) {
        setError(t('subscription.errorLoadingBundles'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBundles();
  }, []);

  const handleSubscribeClick = (bundle: Bundle) => {
    router.push(
      `/subscription/payment?bundleId=${bundle.id}&discountedPrice=${bundle.price}&subscriberType=organization&isRecurring=false`
    );
  };

  const getRecurringTypeLabel = (recurringType: string) => {
    switch (recurringType) {
      case "Monthly":
        return t('subscription.recurringTypes.monthly');
      case "Weekly":
        return t('subscription.recurringTypes.weekly');
      case "Daily":
        return t('subscription.recurringTypes.daily');
      case "Yearly":
        return t('subscription.recurringTypes.yearly');
      default:
        return recurringType;
    }
  };

  const getBundleNameLabel = (name: string) => {
    switch (name.toLowerCase()) {
      case "basic":
        return t('subscription.bundleNames.basic');
      case "standard":
        return t('subscription.bundleNames.standard');
      case "premium":
        return t('subscription.bundleNames.premium');
      default:
        return name;
    }
  };

  const getBundleTypeLabel = (type: string) => {
    switch (type) {
      case "GP Consultations":
        return t('subscription.bundleTypes.gpConsultations');
      case "Specialist Consultations":
        return t('subscription.bundleTypes.specialistConsultations');
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-center justify-center py-8">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir={isRTL ? "rtl" : "ltr"}>
        <h3 className="text-gray-800 text-lg font-semibold mb-2">
          {t('subscription.availableBundles')}
        </h3>
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-red-500 text-sm mb-2">{error}</p>
          <p className="text-gray-400 text-xs">{t('subscription.couldNotLoadBundles')}</p>
        </div>
      </div>
    );
  }

  if (bundles.length === 0) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir={isRTL ? "rtl" : "ltr"}>
        <h3 className="text-gray-800 text-lg font-semibold mb-2">
          {t('subscription.availableBundles')}
        </h3>
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <p className="text-gray-500 text-sm">{t('subscription.noBundlesAvailable')}</p>
          <p className="text-gray-400 text-xs mt-2">{t('subscription.contactAdmin')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* Info Note - At Top */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-lg font-semibold text-blue-700 text-center">
          💡 {t('subscription.infoNote')}
        </p>
      </div>

      <h3 className="text-gray-800 text-lg font-semibold mb-2">
        {t('subscription.availableBundles')}
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        {t('subscription.chooseBundleSubtitle')}
      </p>

      {/* Terms and Conditions Checkbox */}
      <label className="flex items-start gap-3 mb-4 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-custom-green flex-shrink-0 cursor-pointer"
        />
        <span className="text-sm text-gray-600">
          {isRTL ? (
            <>
              أوافق على{" "}
              <a
                href="/termsandConditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-custom-green underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                الشروط والأحكام
              </a>
            </>
          ) : (
            <>
              I agree to the{" "}
              <a
                href="/termsandConditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-custom-green underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Terms and Conditions
              </a>
            </>
          )}
        </span>
      </label>

      {/* Bundles Grid */}
      <div className="space-y-3">
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-custom-green hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-lg font-bold text-gray-800">
                  {getBundleNameLabel(bundle.name)}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {getBundleTypeLabel(bundle.type)}
                </p>
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-1">
                  {getRecurringTypeLabel(bundle.recurringType)}
                </span>
              </div>
              <div className={isRTL ? "text-left" : "text-right"}>
                <p className="text-2xl font-bold text-custom-green">
                  {Number(bundle.price).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">{bundle.currency || t('consultationPrice.currency')}</p>
              </div>
            </div>

            {/* Consultations Count */}
            <div className="bg-custom-background rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-custom-green bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-custom-green text-sm">📋</span>
                  </div>
                  <span className="text-gray-700 text-sm">{t('subscription.consultationsCount')}</span>
                </div>
                <span className="text-xl font-bold text-custom-green">
                  {bundle.consultationCount}
                </span>
              </div>
            </div>

            {bundle.description && (
              <p className="text-gray-500 text-xs mb-3">{bundle.description}</p>
            )}

            {/* Subscribe Button */}
            <button
              onClick={() => handleSubscribeClick(bundle)}
              disabled={!termsAccepted}
              className="w-full bg-custom-green text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('subscription.subscribeNow')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableBundlesSection;
