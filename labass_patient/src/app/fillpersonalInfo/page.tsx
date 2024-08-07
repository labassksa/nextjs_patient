// src/pages/PersonalInfoPage.tsx
import React from "react";
import PersonalInfoHeader from "./_components/userPersonalInfo/Header";
import PersonalInfoForm from "./_components/userPersonalInfo/form";

const PersonalInfoPage: React.FC = () => {
  return (
    <div className="bg-custom-background min-h-screen flex flex-col">
      <PersonalInfoHeader />
      <PersonalInfoForm />
    </div>
  );
};

export default PersonalInfoPage;
