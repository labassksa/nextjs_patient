"use client";
import React, { useState } from "react";
import PaymentIntro from "./_components/payment/paymentIntro";
import PaymentMethod from "./_components/payment/paymentMethod";
import PaymentSummary from "./_components/payment/paymentSummary";
import PaymentButton from "./_components/payment/paymentButton";
import PromoCode from "./_components/payment/promoCodeInput"; // Ensure correct path
import { PaymentMethodEnum } from "../../types/paymentMethods";
import Header from "../../components/common/header";

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodEnum.Card);
  const [discountedPrice, setDiscountedPrice] = useState(89); // Default price
  const [promoCode, setPromoCode] = useState(""); // Track applied promo code

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header title="ادفع" showBackButton />
      <div className="pt-16 flex-grow overflow-auto">
        <PaymentIntro />
        <PaymentMethod method={paymentMethod} setMethod={setPaymentMethod} />
        <div className="my-4">
          {/* Pass setDiscountedPrice and setPromoCode to PromoCode */}
          <PromoCode
            setDiscountedPrice={setDiscountedPrice}
            setPromoCode={setPromoCode}
          />
        </div>
        <PaymentSummary discountedPrice={discountedPrice} />
      </div>
      <div className="m-2 pb-4 sticky bottom-0">
        {/* Pass the updated discountedPrice and promoCode to PaymentButton */}
        <PaymentButton
          method={paymentMethod}
          discountedPrice={discountedPrice}
          promoCode={promoCode}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
