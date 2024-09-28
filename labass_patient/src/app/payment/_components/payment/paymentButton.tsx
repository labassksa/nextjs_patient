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
  const applePayConfigRef = useRef<ApplePayConfig | null>(null);
  const scriptLoadedRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to initialize or reinitialize Apple Pay
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

          // Ensure the script is loaded and initialize Apple Pay
          if (scriptLoadedRef.current) {
            window.myFatoorahAP.init(applePayConfigRef.current);
            setIsInitialized(true);

            // After initializing, update the amount displayed in Apple Pay
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

  // Load Apple Pay script
  useEffect(() => {
    const loadApplePayScript = () => {
      const script = document.createElement("script");
      script.src = "https://sa.myfatoorah.com/applepay/v3/applepay.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log("Apple Pay script loaded successfully.");
        scriptLoadedRef.current = true;

        // Initialize Apple Pay when the script is loaded
        if (applePayConfigRef.current) {
          window.myFatoorahAP.init(applePayConfigRef.current);
          setIsInitialized(true);

          // Update amount in Apple Pay after initialization
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

  // Reinitialize Apple Pay when either the payment method or discounted price changes
  useEffect(() => {
    if (method === PaymentMethodEnum.ApplePay) {
      const container = document.getElementById("apple-pay-container");
      if (container) {
        container.innerHTML = ""; // Clear the previous Apple Pay button
      }
      initializeApplePay(); // Reinitialize with new values
    }
  }, [discountedPrice, method]);

  const handlePaymentClick = async () => {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      router.push("/login"); // Navigate to login page
    }
    if (loading) return; // Prevent multiple initiations
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

            // Update Apple Pay amount after re-initialization
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

      console.log(
        `Executing payment with amount: ${discountedPrice} and promoCode: ${promoCode}`
      );

      const response = await axios.post(
        `${apiUrl}/execute-payment`,
        {
          SessionId: sessionId,
          DisplayCurrencyIso: "SAR",
          InvoiceValue: discountedPrice.toFixed(2), // Ensure this is the discounted price
          PromoCode: promoCode, // Include the applied promo code
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
        const consultationId = response.data.consultation;
        // Push to the chat page with consultationId in the URL
        router.push(`/chat/${consultationId}`);

        if (paymentResponse.status === 200) {
          console.log("Payment completed successfully:", paymentResponse.data);
          // Extract consultationId from the paymentResponse
        } else {
          console.error("Failed to complete payment:", paymentResponse.data);
        }
      } else {
        console.error("Payment execution failed:", response.data.Message);
      }
    } catch (error) {
      console.error("Error executing payment:", error);
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
          {loading ? "Processing..." : `الدفع بالبطاقة`}{" "}
          {/* Show updated price */}
        </button>
      )}
    </div>
  );
};

export default PaymentButton;
