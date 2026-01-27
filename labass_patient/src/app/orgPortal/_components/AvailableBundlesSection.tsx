"use client";

import React, { useEffect, useState } from "react";
import { getBundles, Bundle } from "../_controllers/getBundles";

interface AvailableBundlesSectionProps {
  onSubscribe?: (bundleId: number) => void;
}

const AvailableBundlesSection: React.FC<AvailableBundlesSectionProps> = ({
  onSubscribe,
}) => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setError(response.message || "حدث خطأ أثناء تحميل الباقات");
        }
      } catch (err) {
        setError("حدث خطأ أثناء تحميل الباقات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBundles();
  }, []);

  const getRecurringTypeLabel = (recurringType: string) => {
    switch (recurringType) {
      case "Monthly":
        return "شهري";
      case "Weekly":
        return "أسبوعي";
      case "Daily":
        return "يومي";
      case "Yearly":
        return "سنوي";
      default:
        return recurringType;
    }
  };

  const getBundleNameLabel = (name: string) => {
    switch (name.toLowerCase()) {
      case "basic":
        return "الباقة الأساسية";
      case "standard":
        return "الباقة المتوسطة";
      case "premium":
        return "الباقة المميزة";
      default:
        return name;
    }
  };

  const getBundleTypeLabel = (type: string) => {
    switch (type) {
      case "GP Consultations":
        return "استشارات طبيب عام";
      case "Specialist Consultations":
        return "استشارات أخصائي";
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
          الاشتراكات
        </h3>
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-red-500 text-sm mb-2">{error}</p>
          <p className="text-gray-400 text-xs">تعذر تحميل الباقات المتاحة</p>
        </div>
      </div>
    );
  }

  if (bundles.length === 0) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir="rtl">
        <h3 className="text-gray-800 text-lg font-semibold mb-2">
          الاشتراكات
        </h3>
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <p className="text-gray-500 text-sm">لا توجد باقات متاحة حالياً</p>
          <p className="text-gray-400 text-xs mt-2">يرجى التواصل مع الإدارة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir="rtl">
      <h3 className="text-gray-800 text-lg font-semibold mb-2">
        باقات الاشتراك المتاحة
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        اختر الباقة المناسبة لك للاستفادة من خدمات الاستشارات
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
                  <span className="text-gray-700 text-sm">عدد الاستشارات</span>
                </div>
                <span className="text-xl font-bold text-custom-green">
                  {bundle.consultationCount}
                </span>
              </div>
            </div>

            {bundle.description && (
              <p className="text-gray-500 text-xs mb-3">{bundle.description}</p>
            )}

            {/* Subscribe Button - TODO: Connect to backend */}
            <button
              onClick={() => {
                // TODO: Implement subscription flow
                // This will be connected to the backend by another developer
                if (onSubscribe) {
                  onSubscribe(bundle.id);
                } else {
                  alert("سيتم ربط هذه الخاصية بالخادم قريباً");
                }
              }}
              className="w-full bg-custom-green text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              اشترك الآن
            </button>
          </div>
        ))}
      </div>

      {/* Info Note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 الاشتراك يتيح لك إنشاء استشارات بتكلفة أقل مع تجديد تلقائي
        </p>
      </div>
    </div>
  );
};

export default AvailableBundlesSection;
