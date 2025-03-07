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

  // From query string
  const sessionId = searchParams.get("sessionId");
  const countryCode = searchParams.get("countryCode") || "SAU";
  const discountedPrice = searchParams.get("discountedPrice") || "0";
  const promoCode = searchParams.get("promoCode") || ""; // match PaymentButton usage

  // For 3D-Secure Iframe
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState<boolean>(false);

  // ------------------------------------------------------------
  // 1) Listen for 3D-Secure postMessage event (if using iframe)
  // ------------------------------------------------------------
  useEffect(() => {
    function handle3DSMessage(event: MessageEvent) {
      if (!event.data) return;

      try {
        console.log("[3DSecure] Received message:", event.data);
        const message = JSON.parse(event.data);
        
        // Log all messages for debugging
        console.log("[3DSecure] Parsed message:", message);
        
        if (message.sender === "MF-3DSecure") {
          const finalUrl = message.url; // e.g. "https://labass.sa/success?paymentId=..."
          console.log("[3DSecure] Completed, finalUrl:", finalUrl);

          // Hide iframe
          setShowIframe(false);
          setIframeSrc(null);

          // Check success or error
          if (finalUrl.includes("/success")) {
            // We can get consultationId and promoCode from localStorage
            // The actual values were stored during execute-payment call
            const consultationId = localStorage.getItem('temp_consultation_id');
            const promoFromUrl = localStorage.getItem('temp_promo_from_url');
            router.push(`/cardDetails/success?consultationId=${consultationId}&promoFromUrl=${promoFromUrl}`);
          } else {
            router.push("/cardDetails/error");
          }
        } else if (message.sender === "CardView") {
          // Handle card view specific messages
          console.log("[CardView] Received message:", message);
          
          if (message.type === 1 && message.data?.IsSuccess) {
            // Card validation successful
            console.log("[CardView] Card validation successful:", message.data);
            // The mf.submit() promise will resolve with this data
          } else if (message.type === 2) {
            // Error message
            console.error("[CardView] Error:", message.data);
            setIsSubmitting(false);
            alert("Card validation failed: " + (message.data?.Message || "Unknown error"));
          }
        }
      } catch (err) {
        console.error("[3DSecure] Error parsing message:", err);
      }
    }

    window.addEventListener("message", handle3DSMessage);
    return () => window.removeEventListener("message", handle3DSMessage);
  }, [router]);

  // ------------------------------------------------------------
  // 2) Load MyFatoorah script and init
  // ------------------------------------------------------------
  useEffect(() => {
    // Log when this effect runs and with what values
    console.log("[MyFatoorah Init] Effect running with:", { 
      isScriptLoaded, 
      hasMyfatoorah: Boolean((window as any).myFatoorah), 
      sessionId 
    });
    
    if (!isScriptLoaded) {
      console.log("[MyFatoorah Init] Waiting for script to load...");
      return;
    }
    
    if (!(window as any).myFatoorah) {
      console.error("[MyFatoorah Init] Script loaded but myFatoorah object not found on window");
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

    console.log("[MyFatoorah Init] Initializing payment with config:", config);
    
    try {
      (window as any).myFatoorah.init(config);
      console.log("[MyFatoorah Init] Payment initialized successfully");
      
      // Check if card element is actually populated
      setTimeout(() => {
        const cardElement = document.getElementById("card-element");
        if (cardElement) {
          console.log("[MyFatoorah Init] Card element check:", {
            hasChildren: cardElement.children.length > 0,
            innerHTML: cardElement.innerHTML.substring(0, 100) + "..." // Log first 100 chars
          });
        } else {
          console.error("[MyFatoorah Init] Card element not found in DOM after initialization");
        }
      }, 1000);
    } catch (error) {
      console.error("[MyFatoorah Init] Failed to initialize payment:", error);
      setIsSubmitting(false);
    }
  }, [isScriptLoaded, sessionId, countryCode]);

  // ------------------------------------------------------------
  // 3) Handle the "Submit" => myFatoorah.submit() => execute-payment
  // ------------------------------------------------------------
  const handlePaymentSubmit = () => {
    console.log("[handlePaymentSubmit] Submitting payment...");
    setIsSubmitting(true);

    const mf = (window as any).myFatoorah;
    if (!mf) {
      console.error("myFatoorah not found on window");
      setIsSubmitting(false);
      alert("Payment system not loaded. Please refresh the page and try again.");
      return;
    }

    // Add additional validation checks
    if (!sessionId) {
      console.error("No sessionId available. Cannot process payment.");
      setIsSubmitting(false);
      alert("Payment session expired. Please go back and try again.");
      return;
    }

    // Check if card element is properly mounted
    const cardElement = document.getElementById("card-element");
    if (!cardElement || cardElement.children.length === 0) {
      console.error("Card element not properly loaded:", cardElement);
      setIsSubmitting(false);
      alert("Payment form not fully loaded. Please refresh and try again.");
      return;
    }

    // Check if iframe is loaded
    const iframe = cardElement.querySelector('iframe');
    if (!iframe) {
      console.error("Card iframe not found");
      setIsSubmitting(false);
      alert("Payment form not properly loaded. Please refresh and try again.");
      return;
    }

    console.log("[Payment] Attempting to submit card details...");
    console.log("[Payment] Iframe source:", iframe.src);
    
    // Add a timeout to prevent infinite loading
    const submitTimeout = setTimeout(() => {
      console.error("[Payment] Submission timed out after 20 seconds");
      setIsSubmitting(false);
      alert("Payment processing timed out. Please try again.");
    }, 20000); // 20 second timeout

    // Add a check for iframe readiness
    const checkIframeReady = () => {
      return new Promise((resolve) => {
        const iframe = document.getElementById('iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          resolve(true);
        } else {
          setTimeout(() => resolve(false), 100);
        }
      });
    };

    // Wait for iframe to be ready before submitting
    checkIframeReady().then(isReady => {
      if (!isReady) {
        console.error("[Payment] Iframe not ready for submission");
        clearTimeout(submitTimeout);
        setIsSubmitting(false);
        alert("Payment form not ready. Please refresh and try again.");
        return;
      }

      mf.submit()
        .then(async (response: any) => {
          clearTimeout(submitTimeout);
          console.log("[Payment] Card submission response:", response);
          
          // Check for the specific response structure we received
          if (response?.type === 1 && response?.data?.IsSuccess) {
            const newSessionId = response.data.Data.SessionId;
            console.log("[Payment] Card validation successful, proceeding with execute-payment");

            // 3a) Now call our backend's execute-payment (like PaymentButton)
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

            try {
              console.log("[Payment] Calling execute-payment with sessionId:", newSessionId);
              
              // Use the same body shape as PaymentButton
              const { data } = await axios.post(
                `${apiUrl}/execute-payment`,
                {
                  SessionId: newSessionId,
                  DisplayCurrencyIso: "SAR",
                  // Convert discountedPrice to number with 2 decimals
                  InvoiceValue: parseFloat(discountedPrice).toFixed(2),
                  PromoCode: promoCode, // pass the same code
                  CallBackUrl: "https://labass.sa/cardDetails/success",
                  ErrorUrl: "https://labass.sa/cardDetails/error",
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              console.log("[Payment] Execute payment response:", data);

              if (data.IsSuccess) {
                const paymentUrl = data.Data.PaymentURL;
                const consultationId = data.consultation; // Get consultation ID from response
                console.log("[Payment] Opening 3D secure iframe with URL:", paymentUrl);
<<<<<<< HEAD
=======
                console.log("[Payment] Current iframe state:", { showIframe, iframeSrc });
>>>>>>> 3c70031 (fix the iframe)

                // Show the 3D-Secure in an iframe
                setIframeSrc(paymentUrl);
                setShowIframe(true);

<<<<<<< HEAD
=======
                // Log state after setting
                console.log("[Payment] Updated iframe state:", { showIframe: true, iframeSrc: paymentUrl });

>>>>>>> 3c70031 (fix the iframe)
                // Store consultationId and promoCode for success page
                localStorage.setItem('temp_consultation_id', consultationId);
                localStorage.setItem('temp_promo_code', promoCode);
                
                // Store information about whether promoCode came from URL
                const isPromoFromUrl = searchParams.get("promoCode") === promoCode && promoCode !== "";
                localStorage.setItem('temp_promo_from_url', isPromoFromUrl ? 'true' : 'false');
              } else {
                console.error("[Payment] Execute payment failed:", data);
                setIsSubmitting(false);
                alert("Payment processing failed: " + (data.Message || "Unknown error"));
                router.push("/cardDetails/error");
              }
            } catch (error: any) {
              console.error("[Payment] Execute payment error:", error);
              console.error("[Payment] Error details:", error.response?.data || "No response data");
              setIsSubmitting(false);
              alert("Error processing payment. Please try again later.");
              router.push("/cardDetails/error");
            }
          } else {
            console.error("[Payment] Invalid response from card submission:", response);
            setIsSubmitting(false);
            alert("Invalid response from payment gateway. Please try again.");
          }
        })
        .catch((error: any) => {
          clearTimeout(submitTimeout);
          console.error("[Payment] Card submit error:", error);
          console.error("[Payment] Error type:", typeof error);
          console.error("[Payment] Error message:", error.message || "No error message");
          setIsSubmitting(false);
          alert("Card validation failed. Please check your card details and try again.");
        });
    });
  };

  // ------------------------------------------------------------
  // 4) Render
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">بوابة الدفع</h1>
        {/* MyFatoorah CardView script */}
        <Script
          src="https://sa.myfatoorah.com/cardview/v2/session.js"
          onLoad={() => {
            console.log("[Script] MyFatoorah script loaded successfully");
            setIsScriptLoaded(true);
          }}
          onError={(e) => {
            console.error("[Script] Error loading MyFatoorah script:", e);
            // Try to reload after 3 seconds
            setTimeout(() => {
              console.log("[Script] Attempting to reload MyFatoorah script...");
              const script = document.createElement('script');
              script.src = "https://sa.myfatoorah.com/cardview/v2/session.js";
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

        {/* Debug information - can be removed in production */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="bg-yellow-100 text-xs p-2 mb-4 rounded">
            <p>Debug Info:</p>
            <ul>
              <li>Script Loaded: {isScriptLoaded ? '✅' : '❌'}</li>
              <li>MyFatoorah Object: {(window as any)?.myFatoorah ? '✅' : '❌'}</li>
              <li>Session ID: {sessionId ? `✅ (${sessionId.substring(0, 8)}...)` : '❌'}</li>
            </ul>
          </div>
        )}

        {/* MyFatoorah card input container */}
        <div id="card-element" className="bg-white rounded-lg shadow-lg p-4 mb-4" />

        {/* Submit button */}
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

      {/* Iframe overlay for 3D-Secure */}
      {showIframe && iframeSrc && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "500px",
              height: "600px",
              background: "white",
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <button
              onClick={() => {
                setShowIframe(false);
                setIframeSrc(null);
              }}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10000,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              ✕
            </button>
            <iframe
              src={iframeSrc}
              style={{ 
                width: "100%", 
                height: "100%", 
                border: "none",
                position: "relative",
                zIndex: 9999,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const CardDetailsPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardDetailsContent />
    </Suspense>
  );
};

export default CardDetailsPage;
