// src/app/insurance/page.tsx
"use client";
import React from "react";
import Header from "../../components/common/header";
import UserDetails from "../../components/linkInsurance/userDetails";
import InsuranceDropdown from "../../components/linkInsurance/dropdown";
import LinkInsuranceButton from "../../components/linkInsurance/buttonLinkInsurance";

const LinkInsurancePage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      <div>
      <Header title="ربط التأمين" showBackButton />
        <div className="px-4 mt-4 text-red-600 font-normal text-sm" dir="rtl">
          ربط التأمين غير متاح حاليا
          <UserDetails
            name="John Doe"
            nationalId="10876321"
            dateOfBirth="9-6-1998"
            nationality="Saudi" 
          />
          <div className="mt-6">
            <InsuranceDropdown
              onChange={(value) => console.log("Selected Insurance:", value)}
            />
          </div>
        </div>
      </div>
      <div className="mx-4 my-6">
        <LinkInsuranceButton />
      </div>
    </div>
  );
};

export default LinkInsurancePage;
