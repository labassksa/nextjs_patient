"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import axios from "axios";

const CardDetailsContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // For 3D-Secure OTP iframe handling
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState<boolean>(false);

  // Retrieve query parameters (provided from InitiateSession endpoint)
  const sessionId = searchParams.get("sessionId");
  const countryCode = searchParams.get("countryCode") || "SAU";
  const currencyCode = "SAR"; // for Saudi Arabia
  const amount = searchParams.get("discountedPrice") || "0";
  const promoCode = searchParams.get("promoCode") || "";

  // Payment callback function (called by MyFatoorah after customer submits payment details)
  const paymentCallback = async (response: any) => {
    console.log("[Payment Callback] Received response:", response);
    if (response.isSuccess) {
      // Use the sessionId from response if available; otherwise, fallback to our initial sessionId
      const currentSessionId = response.sessionId || sessionId;
      console.log("[Payment Callback] Payment form submitted successfully. SessionId:", currentSessionId);

      // Now call ExecutePayment on your backend to process the transaction
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem("labass_token");
        if (!token) {
          console.error("[ExecutePayment] No token found in localStorage.");
          setIsSubmitting(false);
          alert("You need to be logged in to make a payment. Please log in and try again.");
          return;
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error("[ExecutePayment] NEXT_PUBLIC_API_URL is not defined");
          setIsSubmitting(false);
          alert("Configuration error. Please contact support.");
          return;
        }
        const executeResponse = await axios.post(
          `${apiUrl}/execute-payment`,
          {
            SessionId: currentSessionId,
            DisplayCurrencyIso: currencyCode,
            InvoiceValue: parseFloat(amount).toFixed(2),
            PromoCode: promoCode,
            CallBackUrl: "https://labass.sa/cardDetails/success",
            ErrorUrl: "https://labass.sa/cardDetails/error",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("[ExecutePayment] Response:", executeResponse.data);
        if (executeResponse.data.IsSuccess && executeResponse.data.Data.PaymentURL) {
          const paymentUrl = executeResponse.data.Data.PaymentURL;
          console.log("[ExecutePayment] Payment requires 3D Secure. Opening OTP iframe with URL:", paymentUrl);
          setIframeSrc(paymentUrl);
          setShowIframe(true);
        } else if (executeResponse.data.IsSuccess) {
          console.log("[ExecutePayment] Payment processed directly. Redirecting to success page.");
          router.push("/cardDetails/success");
        } else {
          console.error("[ExecutePayment] Failed:", executeResponse.data);
          alert("Payment processing failed: " + (executeResponse.data.Message || "Unknown error"));
          router.push("/cardDetails/error");
        }
      } catch (error: any) {
        console.error("[ExecutePayment] Error:", error);
        alert("Error processing payment. Please try again later.");
        router.push("/cardDetails/error");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.error("[Payment Callback] Payment submission not successful:", response);
      alert("Payment submission failed: " + (response.message || "Unknown error"));
    }
  };

  // Listen for postMessage events from the 3D Secure (OTP) iframe
  useEffect(() => {
    const handle3DSMessage = (event: MessageEvent) => {
      if (!event.data) return;
      try {
        const message = JSON.parse(event.data);
        console.log("[3DSecure] Received message:", message);
        // Proceed only if the sender is exactly "MF-3DSecure"
        if (message.sender === "MF-3DSecure") {
          const finalUrl = message.url;
          console.log("[3DSecure] Completed, finalUrl:", finalUrl);
          // Hide the OTP iframe
          setShowIframe(false);
          setIframeSrc(null);
          // Redirect based on the final URL (which should be your callback or error URL)
          if (finalUrl.includes("/success")) {
            router.push("/cardDetails/success");
          } else {
            router.push("/cardDetails/error");
          }
        }
      } catch (err) {
        console.error("[3DSecure] Error parsing message:", err);
      }
    };
    window.addEventListener("message", handle3DSMessage);
    return () => window.removeEventListener("message", handle3DSMessage);
  }, [router]);

  // Initialize the MyFatoorah Embedded Payment UI once the script is loaded
  useEffect(() => {
    console.log("[MyFatoorah Init] Running with:", { isScriptLoaded, sessionId });
    if (!isScriptLoaded) return;
    if (!(window as any).myFatoorah) {
      console.error("[MyFatoorah Init] Script loaded but myFatoorah object not found");
      return;
    }
    if (!sessionId) {
      console.error("[MyFatoorah Init] No sessionId available");
      return;
    }
    const config = {
      sessionId: sessionId,
      countryCode: countryCode,
      currencyCode: currencyCode,
      amount: amount,
      callback: paymentCallback,
      containerId: "embedded-payment", // The div where the payment UI will be rendered
      paymentOptions: ["Card", "ApplePay", "GooglePay", "STCPay"],
    };
    try {
      (window as any).myFatoorah.init(config);
      console.log("[MyFatoorah Init] Embedded Payment initialized with config:", config);
    } catch (error) {
      console.error("[MyFatoorah Init] Failed to initialize embedded payment:", error);
    }
  }, [isScriptLoaded, sessionId, countryCode, currencyCode, amount]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">بوابة الدفع</h1>
        {/* Load MyFatoorah Embedded Payment Script for Saudi Arabia */}
        <Script
          src="https://sa.myfatoorah.com/payment/v1/session.js"
          onLoad={() => {
            console.log("[Script] MyFatoorah Embedded Payment script loaded successfully");
            setIsScriptLoaded(true);
          }}
          onError={(e) => {
            console.error("[Script] Error loading MyFatoorah script:", e);
          }}
          strategy="afterInteractive"
        />
        {/* Container for rendering the payment form */}
        <div id="embedded-payment" className="bg-white rounded-lg shadow-lg p-4 mb-4" />
        {isSubmitting && (
          <div className="text-center">
            <p>Processing payment, please wait...</p>
          </div>
        )}
      </div>
      {/* Iframe overlay for 3D-Secure OTP page */}
      {showIframe && iframeSrc && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "white",
            zIndex: 9999,
          }}
        >
          <iframe
            src={iframeSrc}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              position: "fixed",
              top: 0,
              left: 0,
            }}
            title="3D Secure Payment"
          />
        </div>
      )}
    </div>
  );
};

const CardDetailsPage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CardDetailsContent />
  </Suspense>
);

export default CardDetailsPage;
