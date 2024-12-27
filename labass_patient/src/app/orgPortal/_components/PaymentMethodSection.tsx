"use client";

import React, { useState } from "react";

// Payment method can be: "online", "cash", "free", or ""
export type PaymentMethod = "online" | "cash" | "free" | "";

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod>>;
  possiblePaymentMethods: PaymentMethod[];
  cashPrice: number | null;
  setCashPrice: React.Dispatch<React.SetStateAction<number | null>>;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethod,
  setPaymentMethod,
  possiblePaymentMethods,
  cashPrice,
  setCashPrice,
}) => {
  const [error, setError] = useState<string>("");

  const handleCashPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    setCashPrice(value);

    if (value !== null && value < 15) {
      setError("المبلغ لا يمكن أن يكون أقل من 15 ريال سعودي.");
    } else {
      setError("");
    }
  };

  return (
    <div
      className="max-w-md text-black mx-auto bg-white p-4 mt-6 rounded shadow-md"
      dir="rtl"
    >
      <h3 className="text-lg font-bold mb-2">طريقة الدفع</h3>
      <p className="text-sm text-gray-700 mb-4">اختر طريقة الدفع المناسبة:</p>
      <div className="flex flex-col gap-2">
        {possiblePaymentMethods
          .filter((method) => method === "cash" || method === "online") // Only include cash and online
          .map((method) =>
            method === "cash" && paymentMethod === "cash" ? (
              <div
                key={method}
                className="border-2 border-green-500 rounded-md p-2 flex flex-col gap-2"
              >
                <button
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className="flex items-center justify-between p-2 w-full text-center rounded-md transition-colors duration-200 bg-custom-green text-white"
                >
                  <span>كاش</span>
                  <span className="text-white font-bold">✔</span>
                </button>
                <div className="mt-2">
                  <label className="font-semibold block mb-1">مبلغ الكاش</label>
                  <p className="font-normal text-xs text-custom-green block mb-2">
                    أدخل المبلغ المستلم من المريض لإصدار فاتورة الكترونية بهذا
                    المبلغ
                  </p>
                  <input
                    type="number"
                    min={15}
                    className={`border px-2 py-1 w-full rounded ${
                      error ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={cashPrice !== null ? cashPrice : ""}
                    onChange={handleCashPriceChange}
                    placeholder="أدخل مبلغ الكاش"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>
              </div>
            ) : (
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
                <span>{method === "online" ? "أونلاين" : "كاش"}</span>
                {paymentMethod === method && (
                  <span className="text-white font-bold">✔</span>
                )}
              </button>
            )
          )}
      </div>
    </div>
  );
};

export default PaymentMethodSection;
