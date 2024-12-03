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

      {/* Title Section */}
      <div className="mt-36 text-black bg-gradient-to-l from-custom-green to-white py-10 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">منصة لابأس</h1>
        <h1 className="text-2xl font-bold mb-4">
          إرشاد المرضى المحتاجين لاستشارة طبية فورية (اونلاين)
        </h1>
        <p className="text-lg">
          أرشد المريض المحتاج للعلاج إلى استشارة فورية واحصل على فرصة لتقديم
          خدمة ذات قيمة عالية
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto pt-12 space-y-12 max-w-4xl">
        {/* Medical Consultation Info Section */}
        <section>
          <div className="flex items-center px-4">
            <h2 className="text-xl text-black font-semibold flex items-center">
              <div className="relative w-8 h-8 ml-2 flex-shrink-0">
                <Image
                  src="/icons/what_is_the_service.png"
                  alt="رمز الاستشارة الطبية"
                  fill
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
              <span>ما هي الخدمة التي تستطيع تقديمها للمرضى؟</span>
            </h2>
          </div>
          <MedicalConsultationInfo />
        </section>

        {/* Earnings Section */}
        <section>
          <div className="flex items-center px-4">
            <h2 className="text-xl text-black font-semibold flex items-center">
              <div className="relative w-8 h-8 ml-2 flex-shrink-0">
                <Image
                  src="/icons/what_you_get_title.png"
                  alt="رمز الأرباح"
                  fill
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
              <span>
                ماذا ستحصل عليه كمسوق لخدمة الاستشارات الطبية الفوريّة؟
              </span>
            </h2>
          </div>
          <EarningsInfo />
        </section>

        {/* Promo Codes Section */}
        <section>
          <div className="flex items-center px-4">
            <h2 className="text-xl text-black font-semibold flex items-center">
              <div className="relative w-8 h-8 ml-2 flex-shrink-0">
                <Image
                  src="/icons/gears.png"
                  alt="رمز التروس"
                  fill
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
              <span>ماهي تكلفة الاستشارة الطبية وما هي أرباحك؟</span>
            </h2>
          </div>
          <PromoCodeInfo />
        </section>

        {/* Registration Form Section */}
        <section className="bg-gradient-to-b from-custom-green to-white p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center mb-4">
            <h2 className="text-3xl font-bold flex items-center">
              <div className="relative w-12 h-12 ml-4 flex-shrink-0">
                <Image
                  src="/icons/join_us.png"
                  alt="رمز الانضمام"
                  fill
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
              <span className="text-black">انضم كمسوّق</span>
            </h2>
          </div>
          <p className="text-black mb-6">
            انضم إلى فريق لابأس وابدأ بتحقيق الأرباح من خلال مساعدة المرضى في
            الحصول على استشارات طبية فورية. ستتلقى رموز خصم ومزيداً من التفاصيل
            حول كيفية البدء مباشرة على واتساب.
          </p>
          <ol className="list-decimal list-inside text-black mb-2 space-y-4">
            <li>
              <strong> </strong> سجل كمسوق بإدخال رقم جوالك واسمك.
            </li>
            <li>
              <strong> </strong> ستصلك أكواد خصم عبر الواتساب والمزيد من
              التفاصيل
            </li>
            <li>
              <strong> </strong> أرشد المرضى لاستخدام الخدمة عبر الموقع
            </li>
          </ol>
          <h2 className="mb-4">
            <a
              href="https://www.labass.sa"
              className="text-blue-500 underline ml-1"
            >
              www.labass.sa
            </a>
          </h2>

          <MarketerRegistrationForm />
        </section>
      </div>
    </div>
  );
};

export default BecomeAMarketerPage;
