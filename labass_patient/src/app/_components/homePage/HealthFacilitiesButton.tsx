// src/app/_components/homePage/HealthFacilitiesButton.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { isAuthenticated } from "../../../utils/auth";

const HealthFacilitiesButton: React.FC = () => {
  const router = useRouter();

  const navigateToOrgPortal = () => {
    if (isAuthenticated()) {
      router.push("/orgPortal");
    } else {
      router.push("/login");
    }
  };

  return (
    <button
      onClick={navigateToOrgPortal}
      className="border border-dashed border-custom-green bg-white text-custom-green text-xs sm:text-sm px-4 font-bold py-3 mb-4 rounded hover:bg-custom-green hover:text-white transition-colors duration-300 w-full flex items-center justify-center gap-2"
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5" />
      <span>دخول المنشآت الصحية</span>
    </button>
  );
};

export default HealthFacilitiesButton;
