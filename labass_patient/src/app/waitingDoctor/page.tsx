"use client";
import React from "react";
import Header from "../../components/common/header";
import DoctorInfoCard from "../../components/waitingDoctor/doctorCard";
import StatusSection from "../../components/waitingDoctor/checkMark";
import Button from "../../components/waitingDoctor/button";

const WaitingForConsultation = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100">
      <Header title="بانتظار الطبيب" showBackButton />
      <div className="flex-grow pt-16 flex flex-col justify-between">
        <div className="p-4">
          <StatusSection />
          <DoctorInfoCard />
        </div>
        <div className="w-full p-2">
          <Button />
        </div>
      </div>
    </div>
  );
};

export default WaitingForConsultation;
