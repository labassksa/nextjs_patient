// _components/ConsultationPriceSection.tsx
"use client";

import React from "react";

interface ConsultationPriceProps {
  selectedPrice: number | null;
  onChange: (price: number) => void;
  possiblePrices: number[];
}

const ConsultationPriceSection: React.FC<ConsultationPriceProps> = ({
  selectedPrice,
  onChange,
  possiblePrices,
}) => {
  return (
    <div className="max-w-md mx-auto bg-white p-4 mt-6 mb-2 rounded " dir="rtl">
      <h3 className="text-lg font-bold mb-2">سعر الاستشارة</h3>
      <p className="text-sm text-gray-700 mb-2">اختر قيمة سعر الاستشارة:</p>
      <div className="bg-white p-4 rounded-lg">
        {possiblePrices.map((price) => (
          <button
            key={price}
            type="button"
            onClick={() => onChange(price)}
            className={`flex items-center justify-between p-2 w-full text-black focus:outline-none rounded-md mb-2 ${
              selectedPrice === price
                ? "bg-custom-green text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full ml-2 ${
                  selectedPrice === price ? "bg-white" : "bg-gray-400"
                }`}
              />
              <span>{price} ريال</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConsultationPriceSection;
