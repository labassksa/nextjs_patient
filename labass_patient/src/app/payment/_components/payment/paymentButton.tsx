"use client";

import React, { useState, useEffect, useRef } from "react";
import { PaymentMethodEnum } from "../../../../types/paymentMethods";
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
// Use environment variable for the backend URL
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const PaymentButton: React.FC<PaymentButtonProps> = ({ method }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const applePayConfigRef = useRef<ApplePayConfig | null>(null);
  const scriptLoadedRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadApplePayScript = () => {
      const script = document.createElement("script");
      script.src = "https://demo.myfatoorah.com/applepay/v3/applepay.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log("Apple Pay script loaded successfully.");
        scriptLoadedRef.current = true;
        if (applePayConfigRef.current) {
          (window as any).myFatoorahAP.init(applePayConfigRef.current);
          setIsInitialized(true);
        }
      };

      script.onerror = () => {
        console.error("Error loading Apple Pay script.");
      };

      return () => {
        document.body.removeChild(script);
      };
    };

    if (method === PaymentMethodEnum.ApplePay && !scriptLoadedRef.current) {
      loadApplePayScript();
    } else if (method !== PaymentMethodEnum.ApplePay) {
      const container = document.getElementById("apple-pay-container");
      if (container) {
        container.innerHTML = ""; // remove the apple pay button
        setIsInitialized(false); // Reset isInitialized when switching to another method
      }
    }
  }, [method]);

  const handlePaymentClick = async () => {
    if (loading) return; // Prevent multiple initiations
    setLoading(true);
    try {
      // Use environment variable for the backend URL
      const response = await axios.post(`${apiUrl}/initiate-session`, {
        InvoiceAmount: 100, // Use actual amount
        CurrencyIso: "KWD", // Use actual currency
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
            countryCode: "KWT", // Use actual country code
            currencyCode: "KWD", // Use actual currency code
            amount: "100", // Use actual amount
            cardViewId: "apple-pay-container", // ID of the div where the Apple Pay button will be loaded
            callback: payment,
            sessionStarted: sessionStarted,
            sessionCanceled: sessionCanceled,
          };

          if (scriptLoadedRef.current) {
            (window as any).myFatoorahAP.init(applePayConfigRef.current);
            setIsInitialized(true);
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

  const executePayment = async (sessionId: string) => {
    try {
      const response = await axios.post(
        `${apiUrl}/execute-payment`,
        {
          SessionId: sessionId,
          DisplayCurrencyIso: "KWD",
          InvoiceValue: 120,
          CallBackUrl: "https://yoursite.com/success",
          ErrorUrl: "https://yoursite.com/error",
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InBhdGllbnQiLCJwYXRpZW50UHJvZmlsZSI6eyJ1c2VyIjp7ImNyZWF0ZWRBdCI6IjIwMjQtMDgtMjlUMTk6MjE6MDguNjYzWiIsImlkIjoxLCJwaG9uZU51bWJlciI6Iis5NjY1OTE3MTcwMjQiLCJmaXJzdE5hbWUiOm51bGwsImxhc3ROYW1lIjpudWxsLCJlbWFpbCI6bnVsbCwiZ2VuZGVyIjpudWxsLCJuYXRpb25hbElkIjpudWxsLCJkYXRlT2ZCaXJ0aCI6bnVsbCwicmVnaXN0cmF0aW9uVG9rZW4iOm51bGwsInJvbGUiOiJwYXRpZW50In0sImlkIjoxfSwiaWF0IjoxNzI0OTU5MjY4fQ.YcDn0Fs8Dg9fLF_4LyYfb7z7OAwegHQLuf4AfHOBFGo`, // Add the Bearer token here
          },
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
    const sessionId = response.sessionId;
    executePayment(sessionId);
  };

  const sessionStarted = () => {
    console.log("Session started");
  };

  const sessionCanceled = () => {
    console.log("Session canceled");
  };

  useEffect(() => {
    if (method === PaymentMethodEnum.ApplePay) {
      handlePaymentClick();
      const container = document.getElementById("apple-pay-container");
      if (container) {
        container.style.display = "block"; // Show the Apple Pay button
      }
    }
  }, [method]);

  return (
    <div>
      <div id="apple-pay-container"></div>
      {method === PaymentMethodEnum.Card && (
        <button
          className="sticky bottom-0 pb-4 w-full font-bold bg-custom-green text-white py-4 px-4 rounded-3xl"
          dir="rtl"
          onClick={handlePaymentClick}
          disabled={loading}
        >
          {loading ? "Processing..." : "الدفع"}
        </button>
      )}
    </div>
  );
};

export default PaymentButton;
