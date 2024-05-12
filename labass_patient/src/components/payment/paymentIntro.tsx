import React from "react";

const PaymentIntro: React.FC = () => {
  return (
    <div className="bg-custom-background text-black p-4 mt-2 mb" dir="rtl">
      <p>سيتم تحويلك الى طبيب عام خلال ثلاثة دقائق</p>
      <h2 className="text-lg font-semibold mt-4">طرق الدفع المتوفرة</h2>
      <div className="flex justify-around mt-4">
        <img src="/icons/visa.svg" alt="Visa" />
        <img src="/icons/mada.svg" alt="Maestro" />
        <img src="/icons/mc.svg" alt="Mastercard" />
        <img src="/icons/apple_pay.svg" alt="Apple Pay" />
      </div>
    </div>
  );
};

export default PaymentIntro;
