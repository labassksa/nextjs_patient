// "use client";
import React from "react";
import Image from "next/image";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation"; // Correct import should be 'next/router', not 'next/navigation'
import { isAuthenticated } from "../../utils/auth";

const ConsultationButton: React.FC = () => {
  const router = useRouter();

  const navigateToPayment = () => {
    if (isAuthenticated()) {
      router.push("/payment"); // Navigate to payment if authenticated
    } else {
      router.push("/login"); // Redirect to login if not authenticated
    }
  };

  return (
    <div
      onClick={navigateToPayment}
      className="relative mt-4 mb-6 bg-custom-green p-2 rounded-lg text-right text-white mx-1 overflow-hidden"
      style={{ position: "relative", overflow: "hidden" }} // Ensure overflow is hidden
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between gap-2">
            <div className="flex bg-custom-background rounded-2xl px-1 py-1 ">
              <div className="flex flex-row justify-center">
                <p className=" text-xs font-semibold text-black " dir="rtl">
                  أقل من دقيقة
                </p>
              </div>
              <ClockIcon className="h-6 w-6 text-black" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-extrabold" dir="rtl">
              استشارة طبية فورية
            </h2>
          </div>
          <p className="my-2 " dir="rtl">
            وصفة طبية
          </p>
          <p className="my-2 " dir="rtl">
            قراءة نتائج تحليل المختبرات
          </p>
          <p className="my-2" dir="rtl">
            إعادة صرف الأدوية
          </p>
          <div className="flex items-center w-full" dir="rtl">
            <span className="font-bold">تواصل مع الطبيب</span>
            <ChevronLeftIcon
              className="h-6 w-6 text-white"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 m-0">
          <Image
            src="/icons/quick_consultation_Button.svg"
            alt="Quick Consultation Image"
            width={220}
            height={220}
            className=""
            style={{ marginBottom: "-40px", marginLeft: "-40px" }} // Adjust this value to control the overflow amount
          />
        </div>
      </div>
    </div>
  );
};

export default ConsultationButton;
