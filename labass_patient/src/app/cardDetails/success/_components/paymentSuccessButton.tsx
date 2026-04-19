"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

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

  const handleContinue = async () => {
    if (!consultationId) {
      console.error("Consultation ID is missing.");
      return;
    }

    const consultationType = localStorage.getItem("consultationType");

    if (consultationType === "obesity") {
      const storedSurveyData = localStorage.getItem("obesitySurveyData");

      if (storedSurveyData) {
        // HOME FLOW: survey was completed before payment → POST it now
        const token = localStorage.getItem("labass_token");
        if (!token) {
          alert("يرجى تسجيل الدخول أولاً");
          return;
        }
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/consultations/${consultationId}/obesity-survey`,
            JSON.parse(storedSurveyData),
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error("Error posting obesity survey:", error);
        }
        localStorage.removeItem("consultationType");
        localStorage.removeItem("obesitySurveyData");
        router.push(`/patientSelection?consultationId=${consultationId}`);
      } else {
        // ORGPORTAL FLOW: no survey yet → send to survey page
        localStorage.setItem("obesityConsultationId", consultationId);
        router.push(`/obesitySurvey?consultationId=${consultationId}`);
      }
      return;
    }

    if (isPromoFromUrl) {
      router.push(`/chat/${consultationId}`);
    } else {
      router.push(`/patientSelection?consultationId=${consultationId}`);
    }
  };

  return (
    <div className="text-center p-4">
      <CheckCircleIcon className="text-custom-green w-24 h-24" />
      <p className="text-lg font-semibold text-black mb-1">تم الدفع بنجاح </p>
      <p className="text-gray-600 text-xs mb-4">
        {isPromoFromUrl 
          ? "يمكنك الآن بدء الاستشارة"
          : "أكمل معلوماتك للحصول على الاستشارة"
        }
      </p>
      
      <button
        onClick={handleContinue}
        className="p-2 w-full text-sm font-bold bg-custom-green text-white rounded-3xl"
        dir="rtl"
      >
        {isPromoFromUrl ? "بدء الاستشارة" : "أكمل معلوماتك"}
      </button>
    </div>
  );
};

export default StatusSection;
