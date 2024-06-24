"use client";

import React, { useState, useEffect, useRef } from "react";
import AppleIcon from "@mui/icons-material/Apple";
import { PaymentMethodEnum } from "../../types/paymentMethods";
import { useRouter } from "next/navigation";
import axios from "axios";

interface PaymentButtonProps {
  method: string;
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

const PaymentButton: React.FC<PaymentButtonProps> = ({ method }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const applePayConfigRef = useRef<ApplePayConfig | null>(null);

  useEffect(() => {
    if (method === PaymentMethodEnum.ApplePay) {
      const script = document.createElement("script");
      script.src = "https://demo.myfatoorah.com/applepay/v3/applepay.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log("Apple Pay script loaded successfully.");
        if (applePayConfigRef.current) {
          window.myFatoorahAP.init(applePayConfigRef.current);
        }
      };

      script.onerror = () => {
        console.error("Error loading Apple Pay script.");
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [method]);

  const handlePaymentClick = async () => {
    if (method === PaymentMethodEnum.Card) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:4000/api_labass/initiate-session",
          {
            InvoiceAmount: 100, // Use actual amount
            CurrencyIso: "KWD", // Use actual currency
          }
        );

        if (response.data.IsSuccess) {
          const { SessionId, CountryCode } = response.data.Data;
          router.push(
            `/cardDetails?sessionId=${SessionId}&countryCode=${CountryCode}`
          );
        } else {
          console.error("Failed to initiate session:", response.data.Message);
        }
      } catch (error) {
        console.error("Error initiating session:", error);
      } finally {
        setLoading(false);
      }
    } else if (method === PaymentMethodEnum.ApplePay) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:4000/api_labass/initiate-session",
          {
            InvoiceAmount: 100, // Use actual amount
            CurrencyIso: "KWD", // Use actual currency
          }
        );

        if (response.data.IsSuccess) {
          const { SessionId } = response.data.Data;

          applePayConfigRef.current = {
            sessionId: SessionId,
            countryCode: "KWT", // Use actual country code
            currencyCode: "KWD", // Use actual currency code
            amount: "100", // Use actual amount
            cardViewId: "card-element",
            callback: payment,
            sessionStarted: sessionStarted,
            sessionCanceled: sessionCanceled,
          };

          if (window.myFatoorahAP) {
            console.log("window.myFatoorahAP is available");
            window.myFatoorahAP.init(applePayConfigRef.current);
            console.log("Initialization completed");
          } else {
            console.error("window.myFatoorahAP is not available");
          }
        } else {
          console.error("Failed to initiate session:", response.data.Message);
        }
      } catch (error) {
        console.error("Error initiating session:", error);
      } finally {
        setLoading(false);
      }
    } else {
      router.push("/userPersonalInfo");
    }
  };

  const executePayment = async (sessionId: any) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api_labass/execute-payment",
        {
          SessionId: sessionId,
        }
      );

      if (response.data.IsSuccess) {
        console.log("Payment successful:", response.data);
      } else {
        console.error("Payment failed:", response.data.Message);
      }
    } catch (error) {
      console.error("Error executing payment:", error);
    }
  };

  const payment = (response: {
    sessionId: string;
    cardBrand: string;
    cardIdentifier: string;
  }) => {
    const { sessionId } = response;
    executePayment(sessionId);
  };

  const sessionStarted = () => {
    console.log("Session started");
  };

  const sessionCanceled = () => {
    console.log("Session canceled");
  };

  if (method === PaymentMethodEnum.ApplePay) {
    return (
      <div>
        <div id="card-element" style={{ display: "none" }}></div>
        <button
          className="sticky bottom-0 pb-4 w-full font-bold bg-black text-white py-4 px-4 rounded-3xl flex justify-center items-center"
          dir="rtl"
          onClick={handlePaymentClick}
          disabled={loading}
        >
          <AppleIcon className="ml-2" />
          {loading ? "Processing..." : "Apple Pay"}
        </button>
      </div>
    );
  } else if (method === PaymentMethodEnum.Card) {
    return (
      <button
        className="sticky bottom-0 pb-4 w-full font-bold bg-custom-green text-white py-4 px-4 rounded-3xl"
        dir="rtl"
        onClick={handlePaymentClick}
        disabled={loading}
      >
        {loading ? "Processing..." : "الدفع"}
      </button>
    );
  }

  return null;
};

export default PaymentButton;
