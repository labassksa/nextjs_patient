// src/pages/PersonalInfoPage.tsx
import React, { Suspense } from "react";
import PersonalInfoHeader from "./_components/userPersonalInfo/Header";
import PersonalInfoForm from "./_components/userPersonalInfo/form";

const PersonalInfoPage: React.FC = () => {
  return (
    <div className="bg-custom-background min-h-screen flex flex-col">
      <PersonalInfoHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <PersonalInfoForm />
      </Suspense>
    </div>
  );
};

export default PersonalInfoPage;
