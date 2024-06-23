"use client"
import React from "react";
import Header from "../../components/common/header";
import PersonalInfoForm from "../../components/userInformation/form";

const PersonalInfo = () => {
  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <Header title="أدخل المعلومات الشخصية" showBackButton />
      <div className="pt-16 w-full"> {/* Adjust this padding to match your header height */}
        <PersonalInfoForm />
      </div>
    </div>
  );
};

export default PersonalInfo;
