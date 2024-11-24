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
        <div className="bg-gradient-to-b from-blue-500 to-blue-200 p-6 rounded-lg shadow-lg text-white">
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
              <span className="text-3xl font-bold text-black ">
                {" "}
                انضم كمسوّق{" "}
              </span>
            </h2>
          </div>
          <p className="text-lg mb-6 text-black">
            انضم إلى برنامجنا التسويقي واحصل على أكواد خصم خاصة بك، وابدأ الكسب
            من خلال الترويج لخدمة الاستشارة الطبية الفورية والوصفات المعتمدة عن
            بعد. قم بالتسجيل أدناه للحصول على الرموز الترويجية ومعرفة الأرباح
            الأسبوعية.
          </p>
          <MarketerRegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default BecomeAMarketerPage;
