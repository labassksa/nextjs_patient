"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const PersonalInfoHeader: React.FC = () => {
  const router = useRouter();

  return (
    <div className="fixed top-0 w-full bg-white p-4 flex items-center justify-between rtl z-10">
      <h1 className="text-lg text-black font-normal flex-grow text-center">
        المعلومات الشخصية
      </h1>
      <button onClick={() => router.back()} className="ml-2">
        <ChevronRightIcon className="h-5 w-5 text-black" aria-hidden="true" />
      </button>
    </div>
  );
};

export default PersonalInfoHeader;
