"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import axios from "axios";

/** Make sure your NEXT_PUBLIC_API_URL is set in .env */
const CardDetailsContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For 3D-Secure
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState<boolean>(false);

  // Passed in query params
  const sessionId = searchParams.get("sessionId");
  const countryCode = searchParams.get("countryCode") || "SAU";
  const discountedPrice = searchParams.get("discountedPrice");

  // ----------------------------------------------------------------
  // 1) Listen for the 3D-Secure event message
  // ----------------------------------------------------------------
  useEffect(() => {
    function handle3DSMessage(event: MessageEvent) {
      if (!event.data) return;

      try {
        const message = JSON.parse(event.data);
        // MyFatoorah sends the following once the OTP step is done:
        //    { sender: "MF-3DSecure", url: "https://yoursite.com/success?paymentId=..." }
        if (message.sender === "MF-3DSecure") {
          const finalUrl = message.url; // e.g. your callback or error URL
          console.log("3D-Secure finished. finalUrl:", finalUrl);

          // 1) Hide the iframe
          setShowIframe(false);
          setIframeSrc(null);

          // 2) Check if it's success or error
          if (finalUrl.includes("/cardDetails/success")) {
            router.push("/cardDetails/success");
          } else {
            router.push("/cardDetails/error");
          }
        }
      } catch (error) {
        // ignore parse errors
      }
    }

    window.addEventListener("message", handle3DSMessage);
    return () => {
      window.removeEventListener("message", handle3DSMessage);
    };
  }, [router]);

  // ----------------------------------------------------------------
  // 2) Initialize MyFatoorah card view after script loads
  // ----------------------------------------------------------------
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

  // ----------------------------------------------------------------
  // 3) Handle Payment Submit => myFatoorah.submit() => ExecutePayment
  // ----------------------------------------------------------------
  const handlePaymentSubmit = () => {
    console.log("[handlePaymentSubmit] Submitting payment...");
    setIsSubmitting(true);

    if (!(window as any).myFatoorah) {
      console.error("myFatoorah object not found on window!");
      setIsSubmitting(false);
      return;
    }

    (window as any).myFatoorah
      .submit()
      .then((response: any) => {
        console.log("[Payment] Card submission response:", response);

        const { sessionId: newSessionId } = response;
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

        // 3a) Execute Payment on your server
        axios
          .post(
            `${apiUrl}/execute-payment`,
            {
              SessionId: newSessionId,
              InvoiceValue: discountedPrice,
              CustomerName: "fname lname",
              DisplayCurrencyIso: "SAR",
              MobileCountryCode: "966",
              CustomerMobile: "",
              CustomerEmail: "",
              CallBackUrl: `${window.location.origin}/cardDetails/success`,
              ErrorUrl: `${window.location.origin}/cardDetails/error`,
              Language: "ar",
              CustomerReference: "card-payment",
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then(({ data }) => {
            if (data.IsSuccess) {
              const paymentUrl = data.Data.PaymentURL;
              console.log(
                "[Payment] Opening 3D secure iframe with URL:",
                paymentUrl
              );
              setIframeSrc(paymentUrl);
              setShowIframe(true);
            } else {
              console.error("[Payment] Execute payment failed:", data);
              setIsSubmitting(false);
              router.push("/cardDetails/error");
            }
          })
          .catch((error) => {
            console.error("[Payment] Execute payment error:", error);
            setIsSubmitting(false);
            router.push("/cardDetails/error");
          });
      })
      .catch((error: any) => {
        console.log("[Payment] Card submit error:", error);
        setIsSubmitting(false);
      });
  };

  // ----------------------------------------------------------------
  // 4) Render
  // ----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100">
      {/* MyFatoorah library script */}
      <Script
        src="https://sa.myfatoorah.com/cardview/v2/session.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="afterInteractive"
      />

      {/* Main container */}
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">بوابة الدفع</h1>
        {/* MyFatoorah Card Element */}
        <div
          id="card-element"
          className="bg-white rounded-lg shadow-lg p-4 mb-4"
        />

        {/* Payment Button */}
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

      {/* 3D-Secure Iframe Overlay */}
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

// Wrap in Suspense if desired
const CardDetailsPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardDetailsContent />
    </Suspense>
  );
};

export default CardDetailsPage;
