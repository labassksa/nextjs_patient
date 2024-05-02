import React from "react";
import Image from "next/image";

const ConsultationButton: React.FC = () => {
  return (
    <div className="relative mt-4 mb-6 bg-custom-green p-4 rounded-lg text-right text-white mx-4">
      <h2 className="text-xl font-bold" dir="rtl">
        استشارة طبية فورية
      </h2>
      <p className="my-2 font-semibold" dir="rtl">
        اطلب استشارة فورية وتواصل مع طبيب عام خلال ثلاث دقائق
      </p>
      <div className="flex justify-between items-center">
        <Image
          src="/images/image.svg"
          alt="Consultation Icon"
          width={120}
          height={120}
          className="ml-4"
        />
        <div>
          <p className="my-2" dir="rtl">
            وصفة طبية.
          </p>
          <p className="my-2" dir="rtl">
            قراءة نتائج تحليل المختبرات.
          </p>
          <p className="my-2" dir="rtl">
            إعادة صرف الأدوية.
          </p>
          <p className="font-bold w-full" dir="rtl">
            تواصل مع الطبيب ←
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsultationButton;
