// src/components/BottomBanner.tsx
import React from "react";
import Image from "next/image";

const BottomBanner: React.FC = () => {
  return (
    <div
      className="fixed top-[11vh] bg-white rounded-lg shadow-lg p-4 px-4 z-20 mx-4
    "
    >
      <div dir="rtl" className="flex justify-start items-center">
        <div className="relative w-16 h-16 p-2">
          <Image
            src="/images/MOHLogo.svg"
            alt="Ministry of Health Logo"
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
        <div className=" text-black flex-col mx-2">
          <h1 className="text-lg font-bold">لاباس</h1>
          <div className="text-xs ml-4 flex-grow">
            شركة مرخصة من وزارة الصحة وتحمل الترخيص رقم 1234213#
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
