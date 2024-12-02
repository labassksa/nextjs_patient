import React from "react";
import Image from "next/image";

const EarningsInfo: React.FC = () => {
  return (
    <div
      dir="rtl"
      className="p-4  bg-gradient-to-l from-blue-600 to-white   text-black"
    >
      <div className="flex items-center mb-2">
        {/* النص والصورة بجانب بعضهما البعض */}
        <h2 className="text-lg mb-2 font-semibold flex items-center">
          <div className="relative w-8 h-8 ml-2 flex-shrink-0">
            <Image
              src="/icons/money2.svg"
              alt="رمز المستحقات"
              fill
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
          <span>أرباحك </span>
        </h2>
      </div>
      <p className="mb-4">
        تعتمد أرباحك على عدد العملاء الذين يستخدمون رموزك الترويجية (أكواد الخصم
        )
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>ترتبط أرباحك برقم هاتفك</li>
        <li>سيتم تحويل أرباحك إليك أسبوعيًا</li>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-black">
            طرق استلام أرباحك
          </h3>
          <ul className="list-disc list-inside text-gray-800 space-y-2 mt-2">
            <li>STC Pay</li>
            <li>تحويل بنكي</li>
          </ul>
        </div>
        <div className="flex items-center mb-4">
          <h1>
            للتحقق من مستحقاتك، تواصل مع الدعم المالي على{" "}
            <strong>٠٥٠٥١١٧٥٥١</strong>
          </h1>
          <div className="relative w-8 h-8 ml-2 flex-shrink-0">
            <Image
              src="/icons/whatapp.png"
              alt="promo code Icon"
              fill
              className="rounded-lg"
            />
          </div>
        </div>
      </ul>
    </div>
  );
};

export default EarningsInfo;
