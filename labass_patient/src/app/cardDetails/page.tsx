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
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState<boolean>(false);

  // Query parameters
  const sessionId = searchParams.get("sessionId");
  const countryCode = searchParams.get("countryCode") || "SAU";
  const discountedPrice = searchParams.get("discountedPrice") || "0";
  const promoCode = searchParams.get("promoCode") || "";

  // 1) Listen for 3D-Secure postMessage event
  useEffect(() => {
    const handle3DSMessage = (event: MessageEvent) => {
      if (!event.data) return;
      try {
        const message = JSON.parse(event.data);
        console.log("[3DSecure] Received message:", message);
        if (message.sender === "MF-3DSecure") {
          const finalUrl = message.url;
          console.log("[3DSecure] Completed, finalUrl:", finalUrl);
          // Hide iframe and reset state
          setShowIframe(false);
          setIframeSrc(null);
          // Route based on success/error
          if (finalUrl.includes("/success")) {
            const consultationId = localStorage.getItem("temp_consultation_id");
            const promoFromUrl = localStorage.getItem("temp_promo_from_url");
            router.push(
              `/cardDetails/success?consultationId=${consultationId}&promoFromUrl=${promoFromUrl}`
            );
          } else {
            router.push("/cardDetails/error");
          }
        } else if (message.sender === "CardView") {
          console.log("[CardView] Received message:", message);
          if (message.type === 1 && message.data?.IsSuccess) {
            console.log("[CardView] Card validation successful:", message.data);
          } else if (message.type === 2) {
            console.error("[CardView] Error:", message.data);
            setIsSubmitting(false);
            alert("Card validation failed: " + (message.data?.Message || "Unknown error"));
          }
        }
      } catch (err) {
        console.error("[3DSecure] Error parsing message:", err);
      }
    };

    window.addEventListener("message", handle3DSMessage);
    return () => window.removeEventListener("message", handle3DSMessage);
  }, [router]);

  // 2) Initialize MyFatoorah once the script is loaded
  useEffect(() => {
    console.log("[MyFatoorah Init] Effect running:", { isScriptLoaded, sessionId });
    if (!isScriptLoaded) {
      console.log("[MyFatoorah Init] Waiting for script load...");
      return;
    }
    if (!(window as any).myFatoorah) {
      console.error("[MyFatoorah Init] Script loaded but myFatoorah object not found");
      return;
    }
    if (!sessionId) {
      console.error("[MyFatoorah Init] No sessionId available");
      return;
    }

    const config = {
      countryCode,
      sessionId,
      cardViewId: "card-element",
      supportedNetworks: "v,m,md,ae", // Visa, Master, Mada, Amex
    };

    try {
      (window as any).myFatoorah.init(config);
      console.log("[MyFatoorah Init] Payment initialized with config:", config);
      setTimeout(() => {
        const cardElement = document.getElementById("card-element");
        if (cardElement) {
          console.log("[MyFatoorah Init] Card element found, children count:", cardElement.children.length);
        } else {
          console.error("[MyFatoorah Init] Card element not found in DOM");
        }
      }, 1000);
    } catch (error) {
      console.error("[MyFatoorah Init] Failed to initialize payment:", error);
      setIsSubmitting(false);
    }
  }, [isScriptLoaded, sessionId, countryCode]);

  // Helper: Poll for iframe readiness
  const waitForIframeReady = async (maxWaitMs = 5000): Promise<boolean> => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const check = () => {
        const cardElement = document.getElementById("card-element");
        const iframe = cardElement?.querySelector("iframe");
        if (iframe && iframe.contentWindow) {
          console.log("[Payment] Iframe is ready");
          resolve(true);
        } else if (Date.now() - startTime > maxWaitMs) {
          resolve(false);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  };

  // 3) Handle payment submission
  const handlePaymentSubmit = async () => {
    console.log("[handlePaymentSubmit] Submitting payment...");
    setIsSubmitting(true);
    const mf = (window as any).myFatoorah;
    if (!mf) {
      console.error("myFatoorah not found on window");
      setIsSubmitting(false);
      alert("Payment system not loaded. Please refresh the page and try again.");
      return;
    }
    if (!sessionId) {
      console.error("No sessionId available. Cannot process payment.");
      setIsSubmitting(false);
      alert("Payment session expired. Please go back and try again.");
      return;
    }
    const cardElement = document.getElementById("card-element");
    if (!cardElement || cardElement.children.length === 0) {
      console.error("Card element not properly loaded:", cardElement);
      setIsSubmitting(false);
      alert("Payment form not fully loaded. Please refresh and try again.");
      return;
    }

    // Wait for the iframe to be ready
    const iframeReady = await waitForIframeReady();
    if (!iframeReady) {
      console.error("[Payment] Iframe not ready for submission");
      setIsSubmitting(false);
      alert("Payment form not ready. Please refresh and try again.");
      return;
    }

    console.log("[Payment] Proceeding with card submission");
    const submitTimeout = setTimeout(() => {
      console.error("[Payment] Submission timed out after 20 seconds");
      setIsSubmitting(false);
      alert("Payment processing timed out. Please try again.");
    }, 20000);

    try {
      const response = await mf.submit();
      clearTimeout(submitTimeout);
      console.log("[Payment] Card submission response:", response);
      if (response?.type === 1 && response?.data?.IsSuccess) {
        const newSessionId = response.data.Data.SessionId;
        console.log("[Payment] Card validation successful, proceeding with execute-payment");
        const token = localStorage.getItem("labass_token");
        if (!token) {
          console.error("No token found in localStorage.");
          setIsSubmitting(false);
          alert("You need to be logged in to make a payment. Please log in and try again.");
          return;
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error("NEXT_PUBLIC_API_URL is not defined");
          setIsSubmitting(false);
          alert("Configuration error. Please contact support.");
          return;
        }
        // Call the backend's execute-payment endpoint
        const { data } = await axios.post(
          `${apiUrl}/execute-payment`,
          {
            SessionId: newSessionId,
            DisplayCurrencyIso: "SAR",
            InvoiceValue: parseFloat(discountedPrice).toFixed(2),
            PromoCode: promoCode,
            CallBackUrl: "https://labass.sa/cardDetails/success",
            ErrorUrl: "https://labass.sa/cardDetails/error",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("[Payment] Execute payment response:", data);
        if (data.IsSuccess) {
          const paymentUrl = data.Data.PaymentURL;
          const consultationId = data.consultation;
          console.log("[Payment] Opening 3D secure iframe with URL:", paymentUrl);
          setIframeSrc(paymentUrl);
          setShowIframe(true);
          localStorage.setItem("temp_consultation_id", consultationId);
          localStorage.setItem("temp_promo_code", promoCode);
          const isPromoFromUrl = searchParams.get("promoCode") === promoCode && promoCode !== "";
          localStorage.setItem("temp_promo_from_url", isPromoFromUrl ? "true" : "false");
        } else {
          console.error("[Payment] Execute payment failed:", data);
          setIsSubmitting(false);
          alert("Payment processing failed: " + (data.Message || "Unknown error"));
          router.push("/cardDetails/error");
        }
      } else {
        console.error("[Payment] Invalid response from card submission:", response);
        setIsSubmitting(false);
        alert("Invalid response from payment gateway. Please try again.");
      }
    } catch (error: any) {
      clearTimeout(submitTimeout);
      console.error("[Payment] Card submit error:", error);
      setIsSubmitting(false);
      alert("Card validation failed. Please check your card details and try again.");
    }
  };

  useEffect(() => {
    console.log("[Iframe] showIframe:", showIframe, "iframeSrc:", iframeSrc);
  }, [showIframe, iframeSrc]);

  // Render component
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">بوابة الدفع</h1>
        <Script
          src="https://sa.myfatoorah.com/cardview/v2/session.js"
          onLoad={() => {
            console.log("[Script] MyFatoorah script loaded successfully");
            setIsScriptLoaded(true);
          }}
          onError={(e) => {
            console.error("[Script] Error loading MyFatoorah script:", e);
            setTimeout(() => {
              console.log("[Script] Attempting to reload MyFatoorah script...");
              const script = document.createElement("script");
              script.src = "https://sa.myfatoorah.com/cardview/v2/session.js";
              script.onload = () => {
                console.log("[Script] MyFatoorah script reloaded successfully");
                setIsScriptLoaded(true);
              };
              script.onerror = () =>
                console.error("[Script] Failed to reload MyFatoorah script");
              document.head.appendChild(script);
            }, 3000);
          }}
          strategy="afterInteractive"
        />
        {process.env.NODE_ENV !== "production" && (
          <div className="bg-yellow-100 text-xs p-2 mb-4 rounded">
            <p>Debug Info:</p>
            <ul>
              <li>Script Loaded: {isScriptLoaded ? "✅" : "❌"}</li>
              <li>MyFatoorah Object: {(window as any)?.myFatoorah ? "✅" : "❌"}</li>
              <li>Session ID: {sessionId ? `✅ (${sessionId.substring(0, 8)}...)` : "❌"}</li>
            </ul>
          </div>
        )}
        <div id="card-element" className="bg-white rounded-lg shadow-lg p-4 mb-4" />
        <button
          onClick={handlePaymentSubmit}
          disabled={isSubmitting}
          className={`w-full bg-custom-green text-white py-3 rounded-lg font-bold relative ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="opacity-0">إتمام الدفع</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            </>
          ) : (
            "إتمام الدفع"
          )}
        </button>
      </div>
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
