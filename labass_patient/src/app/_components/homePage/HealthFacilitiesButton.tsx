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
      className="border border-dashed border-red-500 bg-red-500 text-white text-xs sm:text-sm px-4 font-bold py-3 rounded hover:bg-red-600 hover:border-red-600 transition-colors duration-300 w-full flex items-center justify-center gap-2 mb-4"
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5" />
      <span>دخول المنشآت الصحية</span>
    </button>
  );
};

export default HealthFacilitiesButton;
