"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getBundles, Bundle } from "../_controllers/getBundles";
import { initiatePaymentSession } from "../_controllers/initiatePaymentSession";
import { useRouter } from "next/navigation";

interface AvailableBundlesSectionProps {
  onSubscribe?: (bundleId: number) => void;
}

const AvailableBundlesSection: React.FC<AvailableBundlesSectionProps> = ({
  onSubscribe,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);

  useEffect(() => {
    const fetchBundles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getBundles();
        if (response.success && response.data) {
          // Filter only active bundles
          const activeBundles = response.data.filter((bundle) => bundle.isActive);
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
    setSelectedBundle(bundle);
    setShowModal(true);
  };

  const handleOneTimePayment = async () => {
    if (!selectedBundle) return;

    setIsInitiatingPayment(true);
    try {
      const result = await initiatePaymentSession(selectedBundle.price);
      if (result.success && result.sessionId) {
        // Redirect to card details with bundle info
        const params = new URLSearchParams({
          sessionId: result.sessionId,
          countryCode: result.countryCode || "SAU",
          discountedPrice: String(selectedBundle.price),
          bundleId: String(selectedBundle.id),
        });
        router.push(`/cardDetails?${params.toString()}`);
      } else {
        alert(result.message || "حدث خطأ أثناء بدء جلسة الدفع");
      }
    } catch (err) {
      alert("حدث خطأ أثناء بدء جلسة الدفع");
    } finally {
      setIsInitiatingPayment(false);
      setShowModal(false);
    }
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
      <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir="rtl">
        <div className="flex items-center justify-center py-8">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir="rtl">
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
      <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir="rtl">
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
    <>
      <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir="rtl">
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
                <div className="text-left">
                  <p className="text-2xl font-bold text-custom-green">
                    {Number(bundle.price).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{bundle.currency || "ريال"}</p>
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
                className="w-full bg-custom-green text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                {t('subscription.subscribeNow')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Type Selection Modal (Bottom Sheet) */}
      {showModal && selectedBundle && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
          onClick={() => !isInitiatingPayment && setShowModal(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-t-2xl p-6 animate-slide-up"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {t('subscription.choosePaymentMethod')}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {getBundleNameLabel(selectedBundle.name)} - {Number(selectedBundle.price).toFixed(2)} {selectedBundle.currency || t('consultationPrice.currency')}
            </p>

            <div className="space-y-3">
              {/* One-time payment option */}
              <button
                onClick={handleOneTimePayment}
                disabled={isInitiatingPayment}
                className="w-full flex items-center justify-between p-4 border-2 border-custom-green bg-green-50 rounded-xl hover:bg-green-100 transition-colors disabled:opacity-70"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-custom-green bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-lg">💳</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{t('subscription.oneTimePayment')}</p>
                    <p className="text-xs text-gray-500">{t('subscription.oneTimePaymentDesc')}</p>
                  </div>
                </div>
                {isInitiatingPayment ? (
                  <div className="w-5 h-5 border-2 border-custom-green border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-custom-green text-lg">←</span>
                )}
              </button>

              {/* Recurring payment option (coming soon) */}
              <div className="w-full flex items-center justify-between p-4 border-2 border-gray-200 bg-gray-50 rounded-xl opacity-60 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg">🔄</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-500">{t('subscription.recurringPayment')}</p>
                    <p className="text-xs text-gray-400">{t('subscription.recurringPaymentDesc')}</p>
                  </div>
                </div>
                <span className="bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded-full font-medium">
                  {t('subscription.comingSoon')}
                </span>
              </div>
            </div>

            {/* Cancel button */}
            <button
              onClick={() => setShowModal(false)}
              disabled={isInitiatingPayment}
              className="w-full mt-4 py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              {t('subscription.cancel')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AvailableBundlesSection;
