// src/components/insurance/InsuranceHeader.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

const InsuranceHeader: React.FC = () => {
  const router = useRouter();

  return (
    <div className="bg-white p-4 flex items-center justify-between">
      <h1 className="text-lg text-black font-normal flex-grow text-center ">
        ربط التأمين
      </h1>
      <button onClick={() => router.back()} className="ml-2">
        {" "}
        {/* Adjusted for RTL layout */}
        <ArrowRightIcon className="h-5 w-5 text-black" aria-hidden="true" />
      </button>
    </div>
  );
};

export default InsuranceHeader;
