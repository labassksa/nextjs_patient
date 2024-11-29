import React from "react";
import Image from "next/image";

const EarningsInfo: React.FC = () => {
  return (
    <div
      dir="rtl"
      className="p-4  bg-gradient-to-l from-blue-600 to-blue-300   text-black"
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
          <span>المستحقات المالية</span>
        </h2>
      </div>
      <p className="mb-4">
        تعتمد مستحقاتك المالية على عدد العملاء الذين يستخدمون رموزك الترويجية
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>ترتبط مستحقاتك المالية برقم هاتفك</li>
        <li>سيتم تحويل المستحقات إليك أسبوعيًا</li>
        <div className="flex items-center mb-4">
          <li>
            للتحقق من مستحقاتك، تواصل مع الدعم المالي على{" "}
            <strong>٠٥٠٥١١٧٥٥١</strong>
          </li>
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
