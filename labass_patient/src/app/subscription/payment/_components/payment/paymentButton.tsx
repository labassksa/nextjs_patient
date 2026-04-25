"use client";

import React, { useState, useEffect, useRef } from "react";
import { PaymentMethodEnum } from "@/types/paymentMethods";
import { useRouter } from "next/navigation";
import axios from "axios";
import s from "../../payment.module.css";

interface PaymentButtonProps {
  method: string;
  discountedPrice: number;
  promoCode: string;
  bundleId?: number | null;
  subscriberType?: "patient" | "organization";
  isRecurring?: boolean;
}

interface ApplePayConfig {
  sessionId: string;
  countryCode: string;
  currencyCode: string;
  amount: string;
  cardViewId: string;
  callback: (r: { sessionId: string; cardBrand: string; cardIdentifier: string }) => void;
  sessionStarted: () => void;
  sessionCanceled: () => void;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const SubscriptionPaymentButton: React.FC<PaymentButtonProps> = ({
  method,
  discountedPrice,
  promoCode,
  bundleId,
  subscriberType = "patient",
  isRecurring = false,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const applePayConfigRef = useRef<ApplePayConfig | null>(null);
  const scriptLoadedRef = useRef(false);

  // Load Apple Pay script once
  useEffect(() => {
    if (scriptLoadedRef.current) return;
    const script = document.createElement("script");
    script.src =
      process.env.NEXT_PUBLIC_MYFATOORAH_APPLEPAY_URL ||
      "https://sa.myfatoorah.com/applepay/v3/applepay.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      scriptLoadedRef.current = true;
      if (applePayConfigRef.current) {
        window.myFatoorahAP.init(applePayConfigRef.current);
        window.myFatoorahAP.updateAmount(discountedPrice.toFixed(2));
      }
    };
  }, []);

  // Re-init Apple Pay when price or method changes
  useEffect(() => {
    const container = document.getElementById("apple-pay-container");
    if (container) container.innerHTML = "";
    if (method === PaymentMethodEnum.ApplePay) initApplePay();
  }, [discountedPrice, method]);

  const initApplePay = async () => {
    try {
      const { data } = await axios.post(`${apiUrl}/initiate-session`, {
        InvoiceAmount: discountedPrice,
        CurrencyIso: "SAR",
      });
      if (!data.IsSuccess) return;
      applePayConfigRef.current = {
        sessionId: data.Data.SessionId,
        countryCode: "SAU",
        currencyCode: "SAR",
        amount: discountedPrice.toFixed(2),
        cardViewId: "apple-pay-container",
        callback: applePayCallback,
        sessionStarted: () => {},
        sessionCanceled: () => {},
      };
      if (scriptLoadedRef.current) {
        window.myFatoorahAP.init(applePayConfigRef.current);
        window.myFatoorahAP.updateAmount(discountedPrice.toFixed(2));
      }
    } catch (err) {
      console.error("Apple Pay init error:", err);
    }
  };

  const applePayCallback = (response: { sessionId: string; cardBrand: string; cardIdentifier: string }) => {
    executeSubscriptionPayment(response.sessionId);
  };

  const executeSubscriptionPayment = async (sessionId: string) => {
    const token = localStorage.getItem("labass_token");
    if (!token) { router.push("/login"); return; }
    try {
      const surveyRaw = localStorage.getItem("vitamin_survey_answers");
      const surveyAnswers = surveyRaw ? JSON.parse(surveyRaw) : undefined;
      const { data } = await axios.post(
        `${apiUrl}/execute-subscription-payment`,
        {
          bundleId: bundleId ?? undefined,
          sessionId,
          callBackUrl: "https://labass.sa/success",
          errorUrl: "https://labass.sa/error",
          subscriberType,
          isRecurring,
          promoCode,
          surveyAnswers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        localStorage.removeItem("vitamin_survey_answers");
        setShowModal(true);
      } else {
        console.error("Payment failed:", data);
      }
    } catch (err) {
      console.error("executeSubscriptionPayment error:", err);
    }
  };

  const handleCardPayment = async () => {
    const token = localStorage.getItem("labass_token");
    if (!token) { router.push("/login"); return; }
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${apiUrl}/initiate-session`, {
        InvoiceAmount: discountedPrice,
        CurrencyIso: "SAR",
      });
      if (data.IsSuccess) {
        const { SessionId, CountryCode } = data.Data;
        router.push(
          `/cardDetails?sessionId=${SessionId}&countryCode=${CountryCode}&discountedPrice=${discountedPrice}&promoCode=${encodeURIComponent(promoCode)}${bundleId ? `&bundleId=${bundleId}` : ""}&subscriberType=${subscriberType}&isRecurring=${isRecurring}`
        );
      }
    } catch (err) {
      console.error("Card initiate-session error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Apple Pay container – filled by MyFatoorah script */}
      <div id="apple-pay-container" />

      {/* Card payment button */}
      {method === PaymentMethodEnum.Card && (
        <button
          className={s.payBtn}
          onClick={handleCardPayment}
          disabled={loading}
        >
          {loading ? "جاري التحميل..." : "الدفع بالبطاقة"}
          {!loading && <div className={s.payBtnArr}>←</div>}
        </button>
      )}

      {/* Cash – handled via promo code */}
      {method === PaymentMethodEnum.Cash && (
        <button className={s.payBtn} disabled>
          الدفع نقداً — استخدم الرمز الترويجي أعلاه
        </button>
      )}

      {/* Success modal */}
      {showModal && (
        <div className={s.overlay}>
          <div className={s.modal}>
            <div className={s.modalIcon}>
              <div className={s.modalCheck}>✓</div>
            </div>
            <h3 className={s.modalTitle}>تمت عملية الدفع بنجاح!</h3>
            <p className={s.modalSub}>
              سيتواصل معك فريق لاباس خلال ٢٤ ساعة لتحديد موعد زيارة الممرّض
              وبدء رحلتك الصحية.
            </p>
            <button className={s.modalBtn} onClick={() => router.push("/")}>
              متابعة
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionPaymentButton;
