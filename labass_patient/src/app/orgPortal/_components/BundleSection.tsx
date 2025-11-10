"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface Subscription {
  id: number;
  remainingConsultations: number;
  totalConsultations: number;
  status: string;
  nextBillingDate: string;
  bundle: {
    id: number;
    name: string;
    price: number;
    recurringType: string;
  };
}

interface BundleSectionProps {
  subscription: Subscription | null;
  useBundle: boolean;
  setUseBundle: (value: boolean) => void;
}

const BundleSection: React.FC<BundleSectionProps> = ({
  subscription,
  useBundle,
  setUseBundle,
}) => {
  const { t } = useTranslation();

  if (!subscription) {
    return null;
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg p-6 mt-4" dir="rtl">
      <h3 className="text-gray-800 text-lg font-semibold mb-2">
        الاشتراك الحالي
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        لديك اشتراك فعّال، يمكنك استخدامه لإنشاء الاستشارة
      </p>

      {/* Subscription Details Card */}
      <div className="bg-gradient-to-r from-custom-green to-green-600 rounded-lg p-4 mb-4 text-white shadow-md">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h4 className="text-lg font-bold">{subscription.bundle.name}</h4>
            <p className="text-sm opacity-90">
              {subscription.bundle.recurringType === "Monthly"
                ? "شهري"
                : subscription.bundle.recurringType === "Weekly"
                ? "أسبوعي"
                : subscription.bundle.recurringType === "Daily"
                ? "يومي"
                : subscription.bundle.recurringType}
            </p>
          </div>
          <div className="text-left">
            <p className="text-2xl font-bold">
              {Number(subscription.bundle.price).toFixed(2)} ريال
            </p>
          </div>
        </div>

        <div className="bg-white bg-opacity-20 rounded p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">الاستشارات المتبقية</span>
            <span className="text-xl font-bold">
              {subscription.remainingConsultations}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">إجمالي الاستشارات</span>
            <span className="text-lg font-semibold">
              {subscription.totalConsultations}
            </span>
          </div>
        </div>

        {subscription.nextBillingDate && (
          <p className="text-xs opacity-80 mt-3">
            التجديد القادم:{" "}
            {new Date(subscription.nextBillingDate).toLocaleDateString("en-GB")}
          </p>
        )}
      </div>

      {/* Choice Buttons */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <button
          type="button"
          onClick={() => setUseBundle(true)}
          className={`flex items-center justify-between p-3 w-full rounded-md transition-colors ${
            useBundle
              ? "bg-custom-green text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          aria-pressed={useBundle}
        >
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded-full ml-2 ${
                useBundle ? "bg-white" : "bg-gray-400"
              }`}
            />
            <span className="text-sm font-medium">
              استخدام الاشتراك (مجاناً)
            </span>
          </div>
          {useBundle && (
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
              محدد
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setUseBundle(false)}
          className={`flex items-center justify-between p-3 w-full rounded-md transition-colors ${
            !useBundle
              ? "bg-custom-green text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          aria-pressed={!useBundle}
        >
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded-full ml-2 ${
                !useBundle ? "bg-white" : "bg-gray-400"
              }`}
            />
            <span className="text-sm font-medium">
              الدفع بشكل منفصل (خارج الاشتراك)
            </span>
          </div>
          {!useBundle && (
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
              محدد
            </span>
          )}
        </button>
      </div>

      {/* Warning if low consultations */}
      {subscription.remainingConsultations <= 5 &&
        subscription.remainingConsultations > 0 && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ تنبيه: عدد الاستشارات المتبقية منخفض
            </p>
          </div>
        )}

      {/* Error if no consultations */}
      {subscription.remainingConsultations === 0 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            ❌ لا توجد استشارات متبقية في الاشتراك. سيتم استخدام طريقة الدفع
            المنفصلة.
          </p>
        </div>
      )}
    </div>
  );
};

export default BundleSection;
