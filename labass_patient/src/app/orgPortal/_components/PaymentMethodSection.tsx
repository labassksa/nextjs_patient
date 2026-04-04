"use client";

import { PaymentMethodEnum } from "../../../types/paymentMethods";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Subscription {
  remainingConsultations: number;
  [key: string]: any;
}

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethodEnum;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethodEnum>>;
  possiblePaymentMethods: PaymentMethodEnum[];
  cashPrice: number | null;
  setCashPrice: React.Dispatch<React.SetStateAction<number | null>>;
  subscription?: Subscription | null;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethod,
  setPaymentMethod,
  possiblePaymentMethods,
  cashPrice,
  setCashPrice,
  subscription,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string>("");

  const handleCashPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    setCashPrice(value);

    if (value !== null && value < 15) {
      setError(t('paymentSection.errorMinAmount'));
    } else {
      setError("");
    }
  };

  return (
    <div
      className="max-w-md text-black mx-auto bg-white p-4 mt-6 rounded"
      dir="rtl"
    >
      <h3 className="text-lg font-bold mb-2">{t('paymentSection.title')}</h3>
      <p className="text-sm text-gray-700 mb-4">
        {t('paymentSection.subtitle')}
      </p>
      <div className="flex flex-col gap-2">
        {/* Revenue share payment buttons */}
        {possiblePaymentMethods
          .filter(
            (method) =>
              method === PaymentMethodEnum.THROUGH_ORGANIZATION ||
              method === PaymentMethodEnum.THROUGH_LABASS
          )
          .map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`flex items-center justify-between p-2 w-full text-center rounded-md transition-colors duration-200 ${
                paymentMethod === method
                  ? "bg-custom-green text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-black"
              }`}
            >
              <span>
                {method === PaymentMethodEnum.THROUGH_LABASS
                  ? t('paymentSection.throughLabass')
                  : t('paymentSection.throughOrganization')}
              </span>
              {paymentMethod === method && (
                <span className="text-white font-bold">✔</span>
              )}
            </button>
          ))}

        {/* Use Subscription button — only shown when subscription exists */}
        {subscription && (
          <div className="border-t border-gray-200 mt-3 pt-3">
          <button
            type="button"
            onClick={() => setPaymentMethod(PaymentMethodEnum.USE_SUBSCRIPTION)}
            className={`flex items-center justify-between p-3 w-full rounded-md transition-colors duration-200 border-2 ${
              paymentMethod === PaymentMethodEnum.USE_SUBSCRIPTION
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800"
            }`}
          >
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm">ارسال رابط استشارة باستخدام الباقة</span>
              <span className={`text-xs mt-0.5 ${paymentMethod === PaymentMethodEnum.USE_SUBSCRIPTION ? "text-blue-100" : "text-blue-500"}`}>
                {subscription.remainingConsultations} استشارة متبقية
              </span>
            </div>
            {paymentMethod === PaymentMethodEnum.USE_SUBSCRIPTION && (
              <span className="text-white font-bold">✔</span>
            )}
          </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSection;
