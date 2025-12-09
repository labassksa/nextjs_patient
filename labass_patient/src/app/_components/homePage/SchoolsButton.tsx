// src/app/_components/homePage/SchoolsButton.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { isAuthenticated } from "../../../utils/auth";

const SchoolsButton: React.FC = () => {
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
      className="border border-dashed border-blue-500 bg-white text-blue-500 text-xs sm:text-sm px-4 font-bold py-3 rounded hover:bg-blue-500 hover:text-white transition-colors duration-300 w-full flex items-center justify-center gap-2 mb-4"
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5" />
      <span>دخول المدارس</span>
    </button>
  );
};

export default SchoolsButton;
