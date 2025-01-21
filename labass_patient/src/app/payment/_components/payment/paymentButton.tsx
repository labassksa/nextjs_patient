"use client";

import React, { useState, useEffect, useRef } from "react";
import { PaymentMethodEnum } from "../../../../types/paymentMethods";
import { useRouter } from "next/navigation";
import axios from "axios";

interface PaymentButtonProps {
  method: string;
  discountedPrice: number;
  promoCode: string;
}

interface ApplePayConfig {
  sessionId: string;
  countryCode: string;
  currencyCode: string;
  amount: string;
  cardViewId: string;
  callback: (response: {
    sessionId: string;
    cardBrand: string;
    cardIdentifier: string;
  }) => void;
  sessionStarted: () => void;
  sessionCanceled: () => void;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const PaymentButton: React.FC<PaymentButtonProps> = ({
  method,
  discountedPrice,
  promoCode,
}) => {
  const router = useRouter();

  // States
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [consultationId, setConsultationId] = useState<number | null>(null);

  // Refs to store Apple Pay config and script load status
  const applePayConfigRef = useRef<ApplePayConfig | null>(null);
  const scriptLoadedRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // -----------------------------
  // 1) Initialize Apple Pay
  // -----------------------------
  const initializeApplePay = async () => {
    if (method === PaymentMethodEnum.ApplePay) {
      try {
        // Always send the discounted price to initiate-session
        const response = await axios.post(`${apiUrl}/initiate-session`, {
          InvoiceAmount: discountedPrice,
          CurrencyIso: "SAR",
        });

        if (response.data.IsSuccess) {
          const { SessionId, CountryCode } = response.data.Data;

          // Create Apple Pay config with discountedPrice
          applePayConfigRef.current = {
            sessionId: SessionId,
            countryCode: "SAU",
            currencyCode: "SAR",
            amount: discountedPrice.toFixed(2),
            cardViewId: "apple-pay-container",
            callback: payment,
            sessionStarted: sessionStarted,
            sessionCanceled: sessionCanceled,
          };

          // If script is already loaded, init Apple Pay right now
          if (scriptLoadedRef.current) {
            window.myFatoorahAP.init(applePayConfigRef.current);
            setIsInitialized(true);
            // Update amount to discounted price
            window.myFatoorahAP.updateAmount(discountedPrice.toFixed(2));
          }
        } else {
          console.error("Failed to initiate session:", response.data.Message);
        }
      } catch (error) {
        console.error("Error initiating session:", error);
      }
    }
  };

  // -----------------------------
  // 2) Load Apple Pay Script Once
  // -----------------------------
  useEffect(() => {
    const loadApplePayScript = () => {
      const script = document.createElement("script");
      script.src = "https://sa.myfatoorah.com/applepay/v3/applepay.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log("Apple Pay script loaded successfully.");
        scriptLoadedRef.current = true;

        // If we already have a config (e.g. from initializeApplePay), init now
        if (applePayConfigRef.current) {
          window.myFatoorahAP.init(applePayConfigRef.current);
          setIsInitialized(true);
          // Update to discounted price
          window.myFatoorahAP.updateAmount(discountedPrice.toFixed(2));
        }
      };

      script.onerror = () => {
        console.error("Error loading Apple Pay script.");
      };

      return () => {
        document.body.removeChild(script);
      };
    };

    if (!scriptLoadedRef.current) {
      loadApplePayScript();
    }
  }, []);

  // -----------------------------
  // 3) Re-initialize ApplePay
  //    when discountedPrice or method changes
  // -----------------------------
  useEffect(() => {
    if (method === PaymentMethodEnum.ApplePay) {
      // Clear existing Apple Pay button
      const container = document.getElementById("apple-pay-container");
      if (container) {
        container.innerHTML = "";
      }
      // Now re-initialize with the new discounted price
      initializeApplePay();
    } else {
      // If user switched away from ApplePay, remove the Apple Pay button
      const container = document.getElementById("apple-pay-container");
      if (container) {
        container.innerHTML = "";
      }
    }
  }, [discountedPrice, method]);

  // -----------------------------
  // 4) Generic "Pay" button for other methods
  //    (Card or Apple Pay fallback)
  // -----------------------------
  const handlePaymentClick = async () => {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      router.push("/login"); // Navigate to login page if not logged in
    }
    if (loading) return; // Prevent multiple initiations
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/initiate-session`, {
        InvoiceAmount: discountedPrice, // discounted price again
        CurrencyIso: "SAR",
      });

      if (response.data.IsSuccess) {
        const { SessionId, CountryCode } = response.data.Data;

        if (method === PaymentMethodEnum.Card) {
          // If user chose Card, redirect to card details with session
          router.push(
            `/cardDetails?sessionId=${SessionId}&countryCode=${CountryCode}`
          );
        } else if (method === PaymentMethodEnum.ApplePay) {
          // Re-init ApplePay config with discounted price
          applePayConfigRef.current = {
            sessionId: SessionId,
            countryCode: "SAU",
            currencyCode: "SAR",
            amount: discountedPrice.toFixed(2),
            cardViewId: "apple-pay-container",
            callback: payment,
            sessionStarted: sessionStarted,
            sessionCanceled: sessionCanceled,
          };

          if (scriptLoadedRef.current) {
            window.myFatoorahAP.init(applePayConfigRef.current);
            setIsInitialized(true);
            window.myFatoorahAP.updateAmount(discountedPrice.toFixed(2));
          }
        }
      } else {
        console.error("Failed to initiate session:", response.data.Message);
      }
    } catch (error) {
      console.error("Error initiating session:", error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // 5) Payment & Execution
  // -----------------------------
  const payment = (response: {
    sessionId: string;
    cardBrand: string;
    cardIdentifier: string;
  }) => {
    const sessionId = response.sessionId;
    console.log(`Payment session: ${sessionId}`);
    executePayment(sessionId);
  };

  const executePayment = async (sessionId: string) => {
    try {
      const token = localStorage.getItem("labass_token");
      if (!token) {
        console.error("Token not found in localStorage.");
        return;
      }

      console.log(
        `Executing payment with discounted amount: ${discountedPrice}, promoCode: ${promoCode}`
      );

      const response = await axios.post(
        `${apiUrl}/execute-payment`,
        {
          SessionId: sessionId,
          DisplayCurrencyIso: "SAR",
          InvoiceValue: discountedPrice.toFixed(2), // discounted price
          PromoCode: promoCode, // pass the code if applied
          CallBackUrl: "https://yoursite.com/success",
          ErrorUrl: "https://yoursite.com/error",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.IsSuccess) {
        const paymentUrl = response.data.Data.PaymentURL;
        const consultationId = response.data.consultation;

        // Show success modal
        setPaymentMessage("تمت عملية الدفع بنجاح");
        setConsultationId(consultationId);
        setShowModal(true);

        // This next line might be a "tracking" request or redirect
        // If it redirects, ensure it doesn't break your UI
        await axios.get(paymentUrl);
      }
    } catch (error) {
      console.error("Error executing payment:", error);
    }
  };

  // Modal button callback
  const handleGoToChat = () => {
    if (consultationId) {
      router.push(`/patientSelection?consultationId=${consultationId}`);
    } else {
      console.error("Consultation ID is missing.");
    }
  };

  // Apple Pay session events
  const sessionStarted = () => {
    console.log("Session started");
  };

  const sessionCanceled = () => {
    console.log("Session canceled");
  };

  // -----------------------------
  // 6) Render
  // -----------------------------
  return (
    <div>
      {/* Apple Pay button container */}
      <div id="apple-pay-container"></div>

      {/* If the method is Card, show the standard pay button */}
      {method === PaymentMethodEnum.Card && (
        <button
          className="sticky bottom-0 p-2 w-full text-sm font-bold bg-custom-green text-white rounded-3xl"
          dir="rtl"
          onClick={handlePaymentClick}
          disabled={loading}
        >
          {loading ? "Processing..." : "الدفع بالبطاقة"}
        </button>
      )}

      {/* Payment success/failure modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content text-black">
            <pre>{paymentMessage}</pre>
            <button
              className="text-white bg-custom-green"
              onClick={handleGoToChat}
            >
              أكمل معلوماتك
            </button>
          </div>
        </div>
      )}

      {/* Basic styling for the modal */}
      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        pre {
          text-align: left;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default PaymentButton;
