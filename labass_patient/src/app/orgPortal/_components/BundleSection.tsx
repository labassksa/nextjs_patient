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
    type: string;
    price: number;
    recurringType: string;
  };
}

interface BundleSectionProps {
  subscriptions: Subscription[];
  useBundle: boolean;
  setUseBundle: (value: boolean) => void;
}

const getBundleTypeLabel = (type: string) => {
  if (type === "Specialist Consultations") return "استشارات تخصصية";
  return "استشارات عامة";
};

const BundleSection: React.FC<BundleSectionProps> = ({ subscriptions }) => {
  if (!subscriptions || subscriptions.length === 0) return null;

  return (
    <div className="space-y-3" dir="rtl">
      {subscriptions.map((sub) => (
        <div key={sub.id} className="bg-custom-green text-white rounded-xl px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">{sub.bundle?.name}</span>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
              {getBundleTypeLabel(sub.bundle?.type)}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs opacity-75 mb-0.5">الاستشارات المتبقية</p>
              <p className="text-3xl font-bold leading-none">{sub.remainingConsultations}</p>
            </div>
            <div className="text-left">
              <p className="text-xs opacity-75 mb-0.5">من أصل</p>
              <p className="text-lg font-semibold opacity-90">{sub.totalConsultations}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BundleSection;
