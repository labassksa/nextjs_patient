import React from "react";
import Image from "next/image";

const PromoCodeInfo: React.FC = () => {
  return (
    <div
      dir="rtl"
      className="p-4 bg-gradient-to-l from-orange-600 to-orange-300 border text-black"
    >
      <div className="flex items-center mb-2">
        {/* Text and Image Side by Side */}
        <h2 className="text-xl font-semibold flex items-center">
          <div className="relative w-8 h-8 ml-2 flex-shrink-0">
            <Image
              src="/icons/discount.png"
              alt="promo code Icon"
              fill
              className="rounded-lg"
            />
          </div>
          <span>أكواد الخصم</span>
        </h2>
      </div>
      <p className="mb-4">
        عند التسجيل، ستحصل على ثلاثة رموز ترويجية (أكواد) لقيمة الاستشارة
        الفورية
      </p>
      <ul dir="rtl" className="list-disc list-inside space-y-2">
        <li>
          <strong>كود ٧٠% نسبة خصم</strong>: لتصبح قيمة الاستشارة الفورية مع
          طبيب عام مرخص <strong>٢٧ ريال</strong>
          <div className="text-blue-800 text-lg">
            (أرباحك من الاستشارة <strong>١٠ ريال</strong>)
          </div>
        </li>
        <li>
          <strong>كود ٥٠% نسبة خصم</strong>: لتصبح قيمة الاستشارة الفورية مع
          طبيب عام مرخص <strong>٤٥ ريال</strong>
          <div className="text-blue-800 text-lg">
            (أرباحك من الاستشارة <strong>٢٠ ريال</strong>)
          </div>
        </li>
        <li>
          <strong>كود نقدي</strong>: يمنح هذا الكود المريض استشارة مفتوحة
          <div className="text-blue-800 text-lg font-semibold">
            اجمع المبلغ نقداً من المريض، ثم قم بتزويده بالكود النقدي!
          </div>
          <div className="text-blue-800 text-lg">
            أرباحك من الكود النقدي (عند دفع المريض بالكاش) <strong>٤٠٪</strong>{" "}
            من قيمة الاستشارة
          </div>
        </li>
      </ul>
    </div>
  );
};

export default PromoCodeInfo;
