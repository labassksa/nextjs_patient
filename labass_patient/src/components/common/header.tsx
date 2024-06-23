"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const router = useRouter();

  return (
    <div className="fixed top-0 w-full bg-white p-4 flex items-center justify-between">
      <h1 className="text-lg text-gray-500 font-normal flex-grow text-center">
        {title}
      </h1>
      {showBackButton && (
        <button onClick={() => router.back()} className="ml-2">
          {/* Adjusted for RTL layout */}
          <ChevronRightIcon
            className="h-5 w-5 text-gray-500"
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
};

export default Header;
