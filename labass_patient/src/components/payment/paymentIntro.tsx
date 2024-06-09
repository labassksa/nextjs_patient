import React from "react";
import Image from "next/image";

const PaymentIntro: React.FC = () => {
  return (
    <div className="bg-gray-100 text-black p-4 mt-2" dir="rtl">
      <p>سيتم تحويلك الى طبيب عام خلال ثلاثة دقائق</p>
      <h2 className="text-lg font-semibold mt-4">طرق الدفع المتوفرة</h2>
      <div className="flex justify-around mt-4">
        <Image src="/icons/visa.svg" alt="Visa" width={64} height={40} />
        <Image src="/icons/mada.svg" alt="Maestro" width={64} height={40} />
        <Image src="/icons/mc.svg" alt="Mastercard" width={64} height={40} />
        <Image
          src="/icons/apple_pay.svg"
          alt="Apple Pay"
          width={64}
          height={40}
        />
      </div>
    </div>
  );
};

export default PaymentIntro;
