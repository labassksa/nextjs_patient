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
  // For 3D-Secure Iframe handling
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState<boolean>(false);

  // Retrieve query parameters
  const sessionId = searchParams.get("sessionId");
  const countryCode = searchParams.get("countryCode") || "SAU";
  const discountedPrice = searchParams.get("discountedPrice") || "0";
  const promoCode = searchParams.get("promoCode") || "";
  const consultationType = searchParams.get("consultationType");

  // Store consultationType in localStorage if it exists
  useEffect(() => {
    if (consultationType) {
      localStorage.setItem("consultationType", consultationType);
    }
  }, [consultationType]);

  // 1) Listen for 3D-Secure postMessage event from MyFatoorah's 3DS page
  useEffect(() => {
    const handle3DSMessage = async (event: MessageEvent) => {
      if (!event.data) return;
      try {
        const message = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        console.log("[3DSecure] Received message:", message);
        
        // Handle 3D-Secure completion
        if (message.sender === "MF-3DSecure") {
          const finalUrl = message.url;
          console.log("[3DSecure] Completed, finalUrl:", finalUrl);

          // Hide iframe
          setShowIframe(false);
          setIframeSrc(null);

          // Check success or error
          if (finalUrl.includes("/success")) {
            const consultationId = localStorage.getItem('temp_consultation_id');
            const promoFromUrl = localStorage.getItem('temp_promo_from_url');
            router.push(`/cardDetails/success?consultationId=${consultationId}&promoFromUrl=${promoFromUrl}`);
          } else {
            router.push("/cardDetails/error");
          }
          return;
        }

        // Handle CardView messages
        if (message.sender === "CardView") {
          console.log("[CardView] Received message:", message);
          if (message.type === 1 && message.data?.IsSuccess) {
            console.log("[CardView] Card validation successful:", message.data);
            
            // Extract the new session ID from the validation response
            const newSessionId = message.data.Data.SessionId;
            if (!newSessionId) {
              console.error("[CardView] No SessionId in successful response");
              setIsSubmitting(false);
              router.push("/cardDetails/error");
              return;
            }

            // Proceed with execute-payment
            try {
              const token = localStorage.getItem("labass_token");
              if (!token) {
                console.error("No token found in localStorage.");
                setIsSubmitting(false);
                router.push("/cardDetails/error");
                return;
              }

              const apiUrl = process.env.NEXT_PUBLIC_API_URL;
              if (!apiUrl) {
                console.error("NEXT_PUBLIC_API_URL is not defined");
                setIsSubmitting(false);
                router.push("/cardDetails/error");
                return;
              }

              console.log("[Payment] Executing payment with sessionId:", newSessionId);
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
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              console.log("[Payment] Execute payment response:", data);
              if (data.IsSuccess && data.Data.PaymentURL) {
                const paymentUrl = data.Data.PaymentURL;
                const consultationId = data.consultation;
                console.log("[Payment] Opening 3D Secure iframe with URL:", paymentUrl);
                
                // Store information before showing 3D-Secure iframe
                localStorage.setItem("temp_consultation_id", consultationId);
                localStorage.setItem("temp_promo_code", promoCode);
                const isPromoFromUrl = searchParams.get("promoCode") === promoCode && promoCode !== "";
                localStorage.setItem("temp_promo_from_url", isPromoFromUrl ? "true" : "false");

                // Show 3D-Secure iframe
                setIframeSrc(paymentUrl);
                setShowIframe(true);
              } else {
                console.error("[Payment] Execute payment failed:", data);
                setIsSubmitting(false);
                router.push("/cardDetails/error");
              }
            } catch (error) {
              console.error("[Payment] Execute payment error:", error);
              setIsSubmitting(false);
              router.push("/cardDetails/error");
            }
          } else if (message.type === 2) {
            console.error("[CardView] Error:", message.data);
            setIsSubmitting(false);
            router.push("/cardDetails/error");
          }
        }
      } catch (err) {
        console.error("[3DSecure] Error parsing message:", err);
        setIsSubmitting(false);
        router.push("/cardDetails/error");
      }
    };

    window.addEventListener("message", handle3DSMessage);
    return () => window.removeEventListener("message", handle3DSMessage);
  }, [router, discountedPrice, promoCode, searchParams]);

  // 2) Load and initialize MyFatoorah script after it's loaded
  useEffect(() => {
    console.log("[MyFatoorah Init] Running with:", { isScriptLoaded, sessionId });
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
      // Optionally verify that the card element has been populated
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

  // Helper function: Poll for iframe readiness (up to 5 seconds)
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

  // Update handlePaymentSubmit to only trigger the card validation
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

    // Basic validation checks
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

    // Ensure the embedded iframe is ready before submission
    const iframeReady = await waitForIframeReady();
    if (!iframeReady) {
      console.error("[Payment] Iframe not ready for submission");
      setIsSubmitting(false);
      alert("Payment form not ready. Please refresh and try again.");
      return;
    }

    console.log("[Payment] Proceeding with card submission");
    try {
      // Only trigger the submit - the response will be handled by the message listener
      await mf.submit();
    } catch (error) {
      console.error("[Payment] Card submit error:", error);
      setIsSubmitting(false);
      alert("Card validation failed. Please check your card details and try again.");
    }
  };

  // Debug log for iframe state changes
  useEffect(() => {
    console.log("[Iframe] showIframe:", showIframe, "iframeSrc:", iframeSrc);
  }, [showIframe, iframeSrc]);

  // Render the component
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">بوابة الدفع</h1>
        {/* MyFatoorah CardView script */}
        <Script
          src={process.env.NEXT_PUBLIC_MYFATOORAH_CARDVIEW_URL}
          onLoad={() => {
            console.log("[Script] MyFatoorah script loaded successfully");
            setIsScriptLoaded(true);
          }}
          onError={(e) => {
            console.error("[Script] Error loading MyFatoorah script:", e);
            setTimeout(() => {
              console.log("[Script] Attempting to reload MyFatoorah script...");
              const script = document.createElement("script");
              script.src = process.env.NEXT_PUBLIC_MYFATOORAH_CARDVIEW_URL || "";
              script.onload = () => {
                console.log("[Script] MyFatoorah script reloaded successfully");
                setIsScriptLoaded(true);
              };
              script.onerror = () => console.error("[Script] Failed to reload MyFatoorah script");
              document.head.appendChild(script);
            }, 3000);
          }}
          strategy="afterInteractive"
        />

        {/* Debug Info (remove in production) */}
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

        {/* Container for the card input element (populated by MyFatoorah) */}
        <div id="card-element" className="bg-white rounded-lg shadow-lg p-4 mb-4" />

        {/* Payment Submit Button */}
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

      {/* Iframe overlay for 3D-Secure: This iframe displays the OTP page */}
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
