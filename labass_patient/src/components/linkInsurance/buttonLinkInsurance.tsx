// src/components/LinkInsuranceButton.tsx
import React from "react";
import Link from "next/link";

const LinkInsuranceButton: React.FC = () => {
  return (
    <div className="mx-4">
      <button className="border-2 border-custom-green  bg-white text-custom-green text-sm px-4 font-bold py-4 my-6 rounded-3xl hover:bg-custom-green hover:text-white transition-colors duration-300 w-full mb-24">
        ربط التأمين
      </button>
    </div>
  );
};

export default LinkInsuranceButton;
