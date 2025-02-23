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
        const message = JSON.parse(event.data);
        if (message.sender === "MF-3DSecure") {
          const finalUrl = message.url; // e.g. "https://labass.sa/success?paymentId=..."
          console.log("[3DSecure] Completed, finalUrl:", finalUrl);

          // Hide iframe
          setShowIframe(false);
          setIframeSrc(null);

          // Check success or error
          if (finalUrl.includes("/success")) {
            router.push("/cardDetails/success");
          } else {
            router.push("/cardDetails/error");
          }
        }
      } catch (err) {
        // Ignore parse errors
      }
    }

    window.addEventListener("message", handle3DSMessage);
    return () => window.removeEventListener("message", handle3DSMessage);
  }, [router]);

  // ------------------------------------------------------------
  // 2) Load MyFatoorah script and init
  // ------------------------------------------------------------
  useEffect(() => {
    if (!isScriptLoaded || !(window as any).myFatoorah || !sessionId) return;

    const config = {
      countryCode,
      sessionId,
      cardViewId: "card-element",
      supportedNetworks: "v,m,md,ae", // Visa, Master, Mada, Amex
    };

    console.log("Initializing payment with config:", config);
    try {
      (window as any).myFatoorah.init(config);
      console.log("Payment initialized successfully");
    } catch (error) {
      console.error("Failed to initialize payment:", error);
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
      return;
    }

    mf.submit()
      .then(async (response: any) => {
        console.log("[Payment] Card submission response:", response);
        const newSessionId = response.sessionId;

        // 3a) Now call our backend's execute-payment (like PaymentButton)
        const token = localStorage.getItem("labass_token");
        if (!token) {
          console.error("No token found in localStorage.");
          setIsSubmitting(false);
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error("NEXT_PUBLIC_API_URL is not defined");
          setIsSubmitting(false);
          return;
        }

        try {
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

          if (data.IsSuccess) {
            const paymentUrl = data.Data.PaymentURL;
            console.log("[Payment] Opening 3D secure iframe with URL:", paymentUrl);

            // Show the 3D-Secure in an iframe
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
      })
      .catch((error: any) => {
        console.error("[Payment] Card submit error:", error);
        setIsSubmitting(false);
      });
  };

  // ------------------------------------------------------------
  // 4) Render
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100">
      {/* MyFatoorah CardView script */}
      <Script
        src="https://sa.myfatoorah.com/cardview/v2/session.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="afterInteractive"
      />

      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">بوابة الدفع</h1>
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
            }}
          >
            <iframe
              src={iframeSrc}
              style={{ width: "100%", height: "100%", border: "none" }}
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
