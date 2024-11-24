"use client";

import React from "react";
import TopBanner from "./_components/topBanner";
import BottomBanner from "./_components/bottomBanner";
import MarketerRegistrationForm from "./_components/marketerRegistrationForm";
import PromoCodeInfo from "./_components/promoCodeInfo";
import EarningsInfo from "./_components/earningsInfo";
import MedicalConsultationInfo from "./_components/medicalConsultationInfo";
import Image from "next/image";

const BecomeAMarketerPage = () => {
  return (
    <div dir="rtl" className="relative pb-20 bg-white">
      {/* Banners */}
      <TopBanner />
      <BottomBanner />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pt-60 space-y-8">
        {/* Medical Consultation Card */}
        <MedicalConsultationInfo />

        {/* Earnings Section */}
        <EarningsInfo />

        {/* Promo Codes Section */}
        <PromoCodeInfo />

        {/* Registration Form Section with Gradient */}
        <div className="bg-gradient-to-b from-yellow-600 to-yellow-200 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center mb-2">
            {/* النص والصورة بجانب بعضهما البعض */}
            <h2 className="text-xl font-semibold flex items-center">
              <div className="relative w-12 h-12 ml-2 flex-shrink-0 text-black">
                <Image
                  src="/icons/join_us.png"
                  alt="رمز الاستشارة الطبية"
                  fill
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
              <span className="text-3xl font-bold text-black">
                {" "}
                انضم كمسوّق{" "}
              </span>
            </h2>
          </div>

          {/* Bullet Points */}
          <ul className="list-disc list-inside text-lg text-black mb-6 space-y-2">
            <li>احصل على أكواد خصم خاصة بك.</li>
            <li>ابدأ الكسب من خلال الترويج لخدمة الاستشارة الطبية الفورية.</li>
            <li>روّج للوصفات المعتمدة عن بعد.</li>
            <li>
              قم بالتسجيل أدناه للحصول على الرموز الترويجية ومعرفة الأرباح
              الأسبوعية.
            </li>
          </ul>

          {/* Registration Form */}
          <MarketerRegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default BecomeAMarketerPage;
