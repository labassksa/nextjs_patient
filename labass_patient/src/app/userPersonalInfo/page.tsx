import React from "react";
import PersonalInfoHeader from "../../components/userInformation/header"; // Adjust the path as necessary
import PersonalInfoForm from "../../components/userInformation/form";

const PersonalInfo = () => {
  return (
    <div className="flex flex-col bg-custom-background min-h-screen">
      <PersonalInfoHeader />
      <div className="pt-16 w-full"> {/* Adjust this padding to match your header height */}
        <PersonalInfoForm />
      </div>
    </div>
  );
};

export default PersonalInfo;
