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
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [consultationId, setConsultationId] = useState<string | null>(null); // Add state for consultationId
  const applePayConfigRef = useRef<ApplePayConfig | null>(null);
  const scriptLoadedRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeApplePay = async () => {
    if (method === PaymentMethodEnum.ApplePay) {
      try {
        const response = await axios.post(`${apiUrl}/initiate-session`, {
          InvoiceAmount: discountedPrice,
          CurrencyIso: "SAR",
        });

        if (response.data.IsSuccess) {
          const { SessionId, CountryCode } = response.data.Data;

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
        } else {
          console.error("Failed to initiate session:", response.data.Message);
        }
      } catch (error) {
        console.error("Error initiating session:", error);
      }
    }
  };

  useEffect(() => {
    const loadApplePayScript = () => {
      const script = document.createElement("script");
      script.src = "https://sa.myfatoorah.com/applepay/v3/applepay.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log("Apple Pay script loaded successfully.");
        scriptLoadedRef.current = true;

        if (applePayConfigRef.current) {
          window.myFatoorahAP.init(applePayConfigRef.current);
          setIsInitialized(true);
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

  useEffect(() => {
    if (method === PaymentMethodEnum.ApplePay) {
      const container = document.getElementById("apple-pay-container");
      if (container) {
        container.innerHTML = "";
      }
      initializeApplePay();
    }
  }, [discountedPrice, method]);

  const handlePaymentClick = async () => {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      router.push("/login");
    }
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/initiate-session`, {
        InvoiceAmount: discountedPrice,
        CurrencyIso: "SAR",
      });

      if (response.data.IsSuccess) {
        const { SessionId, CountryCode } = response.data.Data;

        if (method === PaymentMethodEnum.Card) {
          router.push(
            `/cardDetails?sessionId=${SessionId}&countryCode=${CountryCode}`
          );
        } else if (method === PaymentMethodEnum.ApplePay) {
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

  const payment = (response: {
    sessionId: string;
    cardBrand: string;
    cardIdentifier: string;
  }) => {
    const sessionId = response.sessionId;
    console.log(`Payment ${sessionId}`);

    executePayment(sessionId);
  };

  const executePayment = async (sessionId: string) => {
    try {
      const token = localStorage.getItem("labass_token");

      if (!token) {
        console.error("Token not found in localStorage.");
        return;
      }

      const response = await axios.post(
        `${apiUrl}/execute-payment`,
        {
          SessionId: sessionId,
          DisplayCurrencyIso: "SAR",
          InvoiceValue: discountedPrice.toFixed(2),
          PromoCode: promoCode,
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
        const paymentResponse = await axios.get(paymentUrl);

        if (paymentResponse.status === 200) {
          console.log("Payment completed successfully:", paymentResponse.data);
          setPaymentMessage(JSON.stringify(response.data, null, 2)); // Show the full response data in the modal
          setConsultationId(response.data.consultation); // Store consultationId in state
          setShowModal(true);
        } else {
          console.error("Failed to complete payment:", paymentResponse.data);
          setPaymentMessage(`Payment failed: ${response.data.Message}`);
          setShowModal(true);
        }
      }
    } catch (error) {
      setPaymentMessage("حدث خطأ أثناء عملية الدفع");
      setShowModal(true);
      console.error("Error executing payment:", error);
    }
  };

  const handleGoToChat = () => {
    if (consultationId) {
      router.push(`/chat/${consultationId}`); // Navigate to chat with consultationId
    } else {
      console.error("Consultation ID is missing.");
    }
  };

  const sessionStarted = () => {
    console.log("Session started");
  };

  const sessionCanceled = () => {
    console.log("Session canceled");
  };

  return (
    <div>
      <div id="apple-pay-container"></div>
      {method === PaymentMethodEnum.Card && (
        <button
          className="sticky bottom-0 p-2 w-full text-sm font-bold bg-custom-green text-white rounded-3xl"
          dir="rtl"
          onClick={handlePaymentClick}
          disabled={loading}
        >
          {loading ? "Processing..." : `الدفع بالبطاقة`}
        </button>
      )}

      {/* Modal for showing the response message */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <pre>{paymentMessage}</pre>{" "}
            {/* Display the logged response in the modal */}
            <button onClick={handleGoToChat}>انتقل الى الدردشة</button>{" "}
            {/* Go to chat */}
          </div>
        </div>
      )}

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
