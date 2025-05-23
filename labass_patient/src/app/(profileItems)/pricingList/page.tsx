import React from "react";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import { Person2Rounded } from "@mui/icons-material";
import Header from "./_components/header";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="p-4 pt-28 text-right leading-relaxed text-gray-800">
        {/* Placeholder for policy text */}

        <div className="flex p-2 m-2 rounded-lg border shadow border-gray-300 bg-white">
          <div className="w-full flex flex-col justify-between" dir="rtl">
            <div className="flex flex-row justify-between mb-2">
              <div className="flex flex-row items-center">
                <img
                  src="/doctor-ahmed.jpg"
                  alt="Doctor"
                  className="w-20 h-20 rounded-full object-cover border-2 ml-4"
                />
                <div className="flex flex-col jus">
                  <h3 className="font-bold text-md text-black" dir="rtl">
                    اسم الخدمة: استشارة فورية ، طبيب عام
                  </h3>
                  <h3 className="font-normal text-sm text-black" dir="rtl">
                    السعر: SAR 89
                  </h3>
                  <h3 className="font-normal text-sm text-black" dir="rtl">
                    شامل الضريبة
                  </h3>
                  <h3
                    className="font-normal text-sm text-custom-green mt-2"
                    dir="rtl"
                  >
                    طبيب مرخص من هيئة التخصصات الصحية ترخيص رقم 24660368
                  </h3>
                  <h3
                    className="font-normal text-sm text-custom-green mt-2"
                    dir="rtl"
                  >
                    الخبرة: 5 سنوات
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
