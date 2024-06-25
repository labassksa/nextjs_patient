import React from "react";
import { PaymentMethodEnum } from "../../types/paymentMethods";

interface PaymentMethodProps {
  method: string;
  setMethod: React.Dispatch<React.SetStateAction<PaymentMethodEnum>>;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ method, setMethod }) => {
  return (
    <div className="bg-white pt-4 pb-4 mx-4 mt-2 rounded-lg" dir="rtl">
      <h2 className="text-lg font-semibold text-black pr-2">
        اختر طريقة الدفع
      </h2>
      <div className="flex flex-col items-start justify-between mt-4 space-y-2">
        <button
          onClick={() => setMethod(PaymentMethodEnum.Card)}
          className={"flex items-center p-2 w-full text-black"}
        >
          <div
            className={`w-4 h-4 rounded-full ml-2 ${
              method === PaymentMethodEnum.Card
                ? "bg-custom-green"
                : "bg-gray-400"
            }`}
          />
          البطاقة الاتمانية
        </button>
        <div className="w-full border-t border-gray-200"></div>{" "}
        {/* Divider line */}
        <button
          onClick={() => setMethod(PaymentMethodEnum.ApplePay)}
          className={"flex items-center p-2 w-full text-black"}
        >
          <div
            className={`w-4 h-4 rounded-full  ml-2 ${
              method === PaymentMethodEnum.ApplePay
                ? "bg-custom-green"
                : "bg-gray-400"
            }`}
          />
          ابل باي
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
