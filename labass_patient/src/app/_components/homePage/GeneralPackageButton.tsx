"use client";
import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const GeneralPackageButton: React.FC = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/generalPackage")}
      className="relative p-2 rounded-lg text-right text-white mx-1 overflow-hidden mt-4 cursor-pointer"
      style={{ background: "linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)", position: "relative", overflow: "hidden" }}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between gap-2">
            <div className="flex rounded-2xl px-1 py-1" style={{ background: "rgba(255,255,255,0.18)" }}>
              <p className="text-xs font-semibold text-white" dir="rtl">
                ٩٩ ريال / شهر
              </p>
            </div>
            <h2 className="text-lg font-extrabold" dir="rtl">
              استشارة طبية عامة
            </h2>
          </div>
          <p className="my-2 text-xs font-bold" dir="rtl">
            طبيب أسرة مرخّص 24/7
          </p>
          <p className="my-2 text-xs font-bold" dir="rtl">
            إعادة صرف وصفاتك الدائمة
          </p>
          <p className="my-2 text-xs font-bold" dir="rtl">
            وصفة إلكترونية معتمدة
          </p>
          <div className="flex items-center w-full" dir="rtl">
            <span className="font-bold">اشترك الآن</span>
            <ChevronLeftIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
        </div>
        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -10,
            left: 50,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

export default GeneralPackageButton;
