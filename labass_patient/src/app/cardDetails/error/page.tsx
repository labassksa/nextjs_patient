"use client";
import React from "react";
import ErrorSection from "./_components/paymentError";
import Button from "../../waitingDoctor/_components/waitingDoctor/button";

const WaitingForConsultation = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100">
      <div className="flex-grow pt-16 flex flex-col justify-between">
        <div className="p-4">
          <ErrorSection />
        </div>
      </div>
    </div>
  );
};

export default WaitingForConsultation;
