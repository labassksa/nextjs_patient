"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const TermsAndConditionsHeader: React.FC = () => {
  const router = useRouter();

  return (
    <div className="fixed top-0 w-full bg-white p-4 flex items-center justify-between">
      <h1 className="text-lg text-black font-normal flex-grow text-center">
        الشروط والأحكام{" "}
      </h1>
      <button onClick={() => router.back()} className="mr-2">
        <ChevronRightIcon className="h-5 w-5 text-black" aria-hidden="true" />
      </button>
    </div>
  );
};

export default TermsAndConditionsHeader;
