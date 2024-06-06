// src/pages/PersonalInfoPage.tsx
import React from "react";
import PersonalInfoHeader from "../../components/userPersonalInfo/Header";
import PersonalInfoForm from "../../components/userPersonalInfo/form";

const PersonalInfoPage: React.FC = () => {
  return (
    <div className="bg-custom-background min-h-screen flex flex-col">
      <PersonalInfoHeader />
      <PersonalInfoForm />
    </div>
  );
};

export default PersonalInfoPage;
