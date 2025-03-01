"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import StatusSection from "./_components/paymentSuccessButton";
import Button from "../../waitingDoctor/_components/waitingDoctor/button";

const WaitingForConsultation = () => {
  const router = useRouter();

  useEffect(() => {
    // Get stored values
    const consultationId = localStorage.getItem('temp_consultation_id');
    const promoCode = localStorage.getItem('temp_promo_code');

    if (consultationId) {
      // Redirect with the stored values
      if (promoCode && promoCode.trim() !== "") {
        router.push(`/chat/${consultationId}?promoCode=${promoCode}`);
      } else {
        router.push(`/patientSelection?consultationId=${consultationId}`);
      }
      
      // Clean up stored values
      localStorage.removeItem('temp_consultation_id');
      localStorage.removeItem('temp_promo_code');
    }
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100">
      <div className="flex-grow pt-16 flex flex-col justify-between">
        <div className="p-4">
          <StatusSection />
        </div>
        <div className="w-full p-2">
          <Button />
        </div>
      </div>
    </div>
  );
};

export default WaitingForConsultation;
