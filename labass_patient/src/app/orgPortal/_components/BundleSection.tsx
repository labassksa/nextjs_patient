"use client";

import React from "react";

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

const BundleSection: React.FC<BundleSectionProps> = ({ subscription }) => {
  if (!subscription) return null;

  return (
    <div className="bg-custom-green text-white rounded-lg px-4 py-3 flex items-center justify-between" dir="rtl">
      <span className="text-sm font-medium">الاستشارات المتبقية</span>
      <span className="text-2xl font-bold">{subscription.remainingConsultations}</span>
    </div>
  );
};

export default BundleSection;
