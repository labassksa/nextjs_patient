"use client";
import React, { Suspense } from "react";
import StatusSection from "./_components/paymentSuccessButton";
import Button from "../../waitingDoctor/_components/waitingDoctor/button";

// This component doesn't use useSearchParams - it will be managed inside StatusSection
const WaitingForConsultation = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100">
      <div className="flex-grow pt-16 flex flex-col justify-between">
        <div className="p-4">
          <Suspense fallback={<div>Loading...</div>}>
            <StatusSection />
          </Suspense>
        </div>
        <div className="w-full p-2">
          <Button />
        </div>
      </div>
    </div>
  );
};

export default WaitingForConsultation;
