"use client";
import React, { useState } from "react";
import PaymentIntro from "../../components/payment/paymentIntro";
import PaymentMethod from "../../components/payment/paymentMethod";
import PaymentSummary from "../../components/payment/paymentSummary";
import PaymentButton from "../../components/payment/paymentButton";
import PaymentHeader from "../../components/payment/paymentHeader";
import PromoCode from "../../components/payment/promoCodeInput"; // Ensure correct path
import { PaymentMethodEnum } from "../../types/paymentMethods";

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState(
    PaymentMethodEnum.ApplePay
  );

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <PaymentHeader />
      <div className="pt-16 flex-grow overflow-auto">
        <PaymentIntro />
        <PaymentMethod method={paymentMethod} setMethod={setPaymentMethod} />
        <div className="my-4">
          <PromoCode />
        </div>
        <PaymentSummary />
      </div>
      <div className="m-2 pb-4 sticky bottom-0">
        <PaymentButton method={paymentMethod} />
      </div>
    </div>
  );
};

export default PaymentPage;
