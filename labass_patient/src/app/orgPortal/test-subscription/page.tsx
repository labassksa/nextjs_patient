"use client";

import React from "react";

// Static mock data for bundles
const mockBundles = [
  {
    id: 1,
    name: "basic",
    type: "GP Consultations",
    price: 500,
    consultationCount: 50,
    currency: "SAR",
    recurringType: "Monthly",
    isActive: true,
    description: "باقة مناسبة للمنشآت الصغيرة",
  },
  {
    id: 2,
    name: "standard",
    type: "GP Consultations",
    price: 1200,
    consultationCount: 150,
    currency: "SAR",
    recurringType: "Monthly",
    isActive: true,
    description: "باقة مناسبة للمنشآت المتوسطة",
  },
  {
    id: 3,
    name: "premium",
    type: "Specialist Consultations",
    price: 2500,
    consultationCount: 300,
    currency: "SAR",
    recurringType: "Monthly",
    isActive: true,
    description: "باقة شاملة للمنشآت الكبيرة مع استشارات أخصائيين",
  },
];

// Mock active subscription (toggle this to test both views)
const mockSubscription = {
  id: 1,
  remainingConsultations: 45,
  totalConsultations: 150,
  status: "active",
  nextBillingDate: "2025-02-15",
  bundle: {
    id: 2,
    name: "الباقة المتوسطة",
    price: 1200,
    recurringType: "Monthly",
  },
};

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

const TestSubscriptionPage: React.FC = () => {
  const [showActiveSubscription, setShowActiveSubscription] = React.useState(false);
  const [useBundle, setUseBundle] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-xl mx-auto px-4">
        {/* Toggle Button */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm" dir="rtl">
          <p className="text-gray-700 text-sm mb-3">اختر العرض للمعاينة:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowActiveSubscription(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                !showActiveSubscription
                  ? "bg-custom-green text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              بدون اشتراك
            </button>
            <button
              onClick={() => setShowActiveSubscription(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                showActiveSubscription
                  ? "bg-custom-green text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              مع اشتراك فعّال
            </button>
          </div>
        </div>

        {/* Conditional Rendering */}
        {showActiveSubscription ? (
          /* Active Subscription View - Same as BundleSection */
          <div className="bg-white rounded-lg p-6 mt-4" dir="rtl">
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
                  <h4 className="text-lg font-bold">{mockSubscription.bundle.name}</h4>
                  <p className="text-sm opacity-90">
                    {mockSubscription.bundle.recurringType === "Monthly"
                      ? "شهري"
                      : mockSubscription.bundle.recurringType}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold">
                    {Number(mockSubscription.bundle.price).toFixed(2)} ريال
                  </p>
                </div>
              </div>

              <div className="bg-white bg-opacity-20 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">الاستشارات المتبقية</span>
                  <span className="text-xl font-bold">
                    {mockSubscription.remainingConsultations}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">إجمالي الاستشارات</span>
                  <span className="text-lg font-semibold">
                    {mockSubscription.totalConsultations}
                  </span>
                </div>
              </div>

              <p className="text-xs opacity-80 mt-3">
                التجديد القادم:{" "}
                {new Date(mockSubscription.nextBillingDate).toLocaleDateString("en-GB")}
              </p>
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
          </div>
        ) : (
          /* Available Bundles View */
          <div className="bg-white rounded-lg p-6 mt-4" dir="rtl">
            <h3 className="text-gray-800 text-lg font-semibold mb-2">
              باقات الاشتراك المتاحة
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              اختر الباقة المناسبة لك للاستفادة من خدمات الاستشارات
            </p>

            {/* Bundles Grid */}
            <div className="space-y-3">
              {mockBundles.map((bundle) => (
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

                  {/* Subscribe Button */}
                  <button
                    onClick={() => {
                      alert(`سيتم الاشتراك في: ${getBundleNameLabel(bundle.name)}\nسيتم ربط هذه الخاصية بالخادم قريباً`);
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
        )}

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs">
            هذه صفحة معاينة للتصميم فقط
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestSubscriptionPage;
