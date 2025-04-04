import React from "react";
import Image from "next/image";

const BottomBanner: React.FC = () => {
  return (
    <div className="fixed top-[6vh] bg-white rounded-lg shadow-lg p-4 px-4 z-20 mx-4 inset-x-0">
      <div dir="rtl" className="flex items-center">
        <div className="relative w-16 h-16 p-2">
          <Image
            src="/icons/MOHLogo.svg"
            alt="Ministry of Health Logo"
            fill
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
        <div className="text-black flex-col mx-2">
          <h1 className="text-xs font-bold">شركة معالم التطوير</h1>
          <div className="text-xs ml-4 flex-grow">
            شركة مرخصة من وزارة الصحة وتحمل الترخيص رقم 1400055938
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
