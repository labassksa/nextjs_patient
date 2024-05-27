// src/pages/PersonalInfoPage.tsx
import React from "react";
import PersonalInfoHeader from "../../components/personalInfo/Header";
import PersonalInfoForm from "../../components/personalInfo/form";

const PersonalInfoPage: React.FC = () => {
  return (
    <div className="bg-custom-background min-h-screen flex flex-col">
      <PersonalInfoHeader />
      <PersonalInfoForm />
    </div>
  );
};

export default PersonalInfoPage;
