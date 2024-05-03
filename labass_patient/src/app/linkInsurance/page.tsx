// src/app/insurance/page.tsx
"use client";
import React from "react";
import InsuranceHeader from "../../components/linkInsurance/header";
import UserDetails from "../../components/linkInsurance/userDetails";
import InsuranceDropdown from "../../components/linkInsurance/dropdown";
import LinkInsuranceButton from "../../components/linkInsurance/buttonLinkInsurance";

const LinkInsurancePage: React.FC = () => {
  return (
    <div className="bg-custom-background min-h-screen flex-col">
      <InsuranceHeader />
      <UserDetails
        name="John Doe"
        nationality="Saudi"
        nationalId="10876321"
        dateOfBirth="9-6-1998"
      />
      <InsuranceDropdown
        onChange={(value) => console.log("Selected Insurance:", value)}
      />
      {/* Other components will follow */}
      <LinkInsuranceButton />
    </div>
  );
};

export default LinkInsurancePage;
