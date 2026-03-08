"use client";
import React from "react";
import Image from "next/image";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../../utils/auth";

const ObesityConsultationButton: React.FC = () => {
  const router = useRouter();

  const navigateToSurvey = () => {
    if (isAuthenticated()) {
      router.push("/obesitySurvey");
    } else {
      router.push("/login");
    }
  };

  return (
    <div
      onClick={navigateToSurvey}
      className="relative bg-custom-green p-2 rounded-lg text-right text-white mx-1 overflow-hidden mt-4"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between gap-2">
            <div className="flex bg-custom-background rounded-2xl px-1 py-1">
              <div className="flex flex-row justify-center">
                <p className="text-xs font-semibold text-black" dir="rtl">
                  استشارة السمنة
                </p>
              </div>
            </div>
            <h2 className="text-lg font-extrabold" dir="rtl">
              برنامج إنقاص الوزن
            </h2>
          </div>
          <p className="my-2 text-xs font-bold" dir="rtl">
            خطة مخصصة تحت إشراف طبي
          </p>
          <p className="my-2 text-xs font-bold" dir="rtl">
            أدوية وبرامج غذائية
          </p>
          <p className="my-2 text-xs font-bold" dir="rtl">
            متابعة مستمرة مع الطبيب
          </p>
          <div className="flex items-center w-full" dir="rtl">
            <span className="font-bold">ابدأ رحلتك الآن</span>
            <ChevronLeftIcon
              className="h-6 w-6 text-white"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 m-0">
          <Image
            src="/icons/quick_consultation_Button.svg"
            alt="Obesity Consultation Image"
            width={220}
            height={220}
            style={{ marginBottom: "-40px", marginLeft: "-40px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ObesityConsultationButton;
