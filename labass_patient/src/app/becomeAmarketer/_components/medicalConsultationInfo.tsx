"use client";
import React from "react";
import Image from "next/image";

const MedicalConsultationInfo: React.FC = () => {
  return (
    <div
      dir="rtl"
      className="p-4 bg-gradient-to-l from-custom-green to-white border  text-black"
    >
      <div className="flex items-center mb-2">
        {/* النص والصورة بجانب بعضهما البعض */}
        <h2 className="text-lg mb-2 font-semibold flex items-center">
          <div className="relative w-8 h-8 ml-2 flex-shrink-0">
            <Image
              src="/icons/consultation1.png"
              alt="رمز الاستشارة الطبية"
              fill
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
          <span>استشارة طبية فورية (اونلاين)</span>
        </h2>
      </div>
      <p className="mb-4">الوصول للطبيب في أقل من دقيقة </p>
      <p className="mb-4">
        تمكّنك الاستشارات الطبية من الحصول على خدمات فورية للمرضى تشمل:
      </p>
      <div className="flex justify-between items-center mb-4">
        <ul className="list-disc list-inside space-y-2">
          <li>
            {" "}
            وصفة طبية معتمدة ومرخصة من وزارة الصحة (تشمل المضادات الحيوية)
          </li>
          <li>قراءة نتائج تحليل المختبرات</li>
          <li>إعادة صرف الأدوية</li>
        </ul>
        <div className="relative w-12 h-12 ml-2 flex-shrink-0">
          <Image
            src="/icons/drug.png"
            alt="رمز الاستشارة الطبية"
            fill
            objectFit="fit"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalConsultationInfo;
