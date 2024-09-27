// src/components/LinkInsuranceButton.tsx
import React from "react";
import Link from "next/link";

const LinkInsurance: React.FC = () => {
  return (
    <Link href="/linkInsurance" passHref>
      <button className="border border-dashed border-custom-green bg-white text-custom-green text-xs   px-4 font-bold py-2 mb-6 mt-4 rounded hover:bg-custom-green hover:text-white transition-colors duration-300 w-full">
        ربط التأمين
      </button>
    </Link>
  );
};

export default LinkInsurance;
