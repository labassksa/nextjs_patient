"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const StatusSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [isPromoFromUrl, setIsPromoFromUrl] = useState<boolean>(false);

  useEffect(() => {
    // Retrieve data saved during payment process
    let storedConsultationId = localStorage.getItem('temp_consultation_id');
    const storedPromoCode = localStorage.getItem('temp_promo_code');
    let storedPromoFromUrl = localStorage.getItem('temp_promo_from_url');
    
    // Fallback to URL parameters if localStorage is empty
    if (!storedConsultationId) {
      storedConsultationId = searchParams.get('consultationId');
    }
    
    // Fallback for promoFromUrl
    if (storedPromoFromUrl === null) {
      storedPromoFromUrl = searchParams.get('promoFromUrl') || 'false';
    }
    
    setConsultationId(storedConsultationId);
    setPromoCode(storedPromoCode);
    setIsPromoFromUrl(storedPromoFromUrl === 'true');
    
    // Clean up localStorage after retrieving values
    if (storedConsultationId || storedPromoCode) {
      setTimeout(() => {
        localStorage.removeItem('temp_consultation_id');
        localStorage.removeItem('temp_promo_code');
        localStorage.removeItem('temp_promo_from_url');
      }, 1000);
    }
  }, [searchParams]);

  const handleContinue = () => {
    if (consultationId) {
      // Route to chat only if promo code came from URL
      if (promoCode && promoCode.trim() !== "" && isPromoFromUrl) {
        // If promo code exists AND it came from URL, go to chat
        router.push(`/chat/${consultationId}`);
      } else {
        // Otherwise (promoCode from input or no promoCode), go to patient selection
        router.push(`/patientSelection?consultationId=${consultationId}`);
      }
    } else {
      console.error("Consultation ID is missing.");
    }
  };

  return (
    <div className="text-center p-4">
      <CheckCircleIcon className="text-custom-green w-24 h-24" />
      <p className="text-lg font-semibold text-black mb-1">تم الدفع بنجاح </p>
      <p className="text-gray-600 text-xs mb-4">
        أكمل معلوماتك للحصول على الاستشارة
      </p>
      
      <button
        onClick={handleContinue}
        className="p-2 w-full text-sm font-bold bg-custom-green text-white rounded-3xl"
        dir="rtl"
      >
        أكمل معلوماتك
      </button>
    </div>
  );
};

export default StatusSection;
